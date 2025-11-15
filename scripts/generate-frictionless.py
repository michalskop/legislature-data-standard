import json
import glob
import os
from frictionless import Schema, Field

# Mapping from JSON Schema types to Frictionless types
TYPE_MAPPING = {
    'string': 'string',
    'number': 'number',
    'integer': 'integer',
    'boolean': 'boolean',
    'object': 'object',
    'array': 'array',
    'null': 'any',
}

# Mapping from JSON Schema formats to Frictionless types/formats
FORMAT_MAPPING = {
    'date-time': {'type': 'datetime'},
    'date': {'type': 'date'},
    'time': {'type': 'time'},
    'email': {'type': 'string', 'format': 'email'},
    'uri': {'type': 'string', 'format': 'uri'},
}

def convert_property_to_field(prop_name, prop_schema, required_fields):
    """Converts a JSON Schema property to a Frictionless Field."""
    field = {'name': prop_name}

    # Handle complex types like anyOf (used for nullable fields)
    if 'anyOf' in prop_schema:
        # Find the non-null type
        types = [t['type'] for t in prop_schema['anyOf'] if 'type' in t]
        # Find format if present
        formats = [t.get('format') for t in prop_schema['anyOf'] if 'type' in t]
        json_type = next((t for t in types if t != 'null'), 'string')
        json_format = next((f for f in formats if f), None)
    else:
        json_type = prop_schema.get('type', 'string')
        json_format = prop_schema.get('format')

    # Set type and format
    if json_format in FORMAT_MAPPING:
        field.update(FORMAT_MAPPING[json_format])
    else:
        field['type'] = TYPE_MAPPING.get(json_type, 'any')

    if 'description' in prop_schema:
        field['description'] = prop_schema['description']

    # Handle required constraint
    if prop_name in required_fields:
        field.setdefault('constraints', {})['required'] = True

    return field

def generate_table_schema(json_schema_path):
    """Generates a Frictionless Table Schema from a JSON Schema."""
    with open(json_schema_path, 'r') as f:
        schema = json.load(f)

    # Resolve top-level $ref
    if '$ref' in schema:
        ref_name = schema['$ref'].split('/')[-1]
        schema_def = schema['definitions'][ref_name]
    else:
        schema_def = schema

    # Handle array-based schemas (e.g., persons.dt.json)
    if schema_def.get('type') == 'array':
        base_object_schema = schema_def['items']
    # Handle object-based schemas (e.g., person.dt.json)
    else:
        base_object_schema = schema_def

    # Handle schemas with 'allOf' by merging properties
    if 'allOf' in base_object_schema:
        object_schema = {'type': 'object', 'properties': {}, 'required': []}
        for sub_schema in base_object_schema['allOf']:
            object_schema['properties'].update(sub_schema.get('properties', {}))
            object_schema['required'].extend(sub_schema.get('required', []))
    else:
        object_schema = base_object_schema

    if object_schema.get('type') != 'object' or 'properties' not in object_schema:
        # Not a schema we can convert to a table
        return

    required_fields = object_schema.get('required', [])
    fields = []
    for prop_name, prop_schema in object_schema.get('properties', {}).items():
        field_descriptor = convert_property_to_field(prop_name, prop_schema, required_fields)
        fields.append(Field.from_descriptor(field_descriptor))

    table_schema = Schema(fields=fields)

    # Save the schema
    output_path = json_schema_path.replace('.json', '.table.json')
    table_schema.to_json(output_path)
    print(f"✓ Frictionless {os.path.basename(output_path)}")


if __name__ == "__main__":
    schema_dir = os.path.join(os.path.dirname(__file__), '..', 'schemas')
    # Use a set to avoid duplicate processing
    json_schema_files = set()

    # Add files from all patterns to the set
    for pattern in ['*.dt.json', '*.popolo.json', '*.*.*.json']:
        for file_path in glob.glob(os.path.join(schema_dir, pattern)):
            # Exclude the generated .table.json files
            if not file_path.endswith('.table.json'):
                json_schema_files.add(file_path)

    for file_path in sorted(list(json_schema_files)):
        generate_table_schema(file_path)

    print(f"Done. Processed {len(json_schema_files)} JSON schema file(s).")
