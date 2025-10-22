# Schema: PopoloPerson

| Field | Type | Description |
|---|---|---|
|`id`|optional||
|`name`|string|Canonical display name.|
|`other_names`|optional||
|`identifiers`|optional||
|`email`|optional||
|`gender`|optional||
|`pronouns`|optional||
|`birth_date`|optional||
|`death_date`|optional||
|`image`|optional||
|`summary`|optional||
|`biography`|optional||
|`national_identity`|optional||
|`contact_details`|optional||
|`links`|optional||
|`sources`|optional||
|`created_at`|optional||
|`updated_at`|optional||

## Example
```json
{
  "id": "john-q-public",
  "name": "John Q. Public",
  "other_names": [
    {
      "name": "John Public"
    }
  ],
  "identifiers": [
    {
      "scheme": "wikidata",
      "identifier": "Q123"
    }
  ],
  "email": "john.public@example.org",
  "gender": "male",
  "pronouns": "he/him",
  "birth_date": "1960-07-15",
  "image": "https://example.org/john.jpg",
  "summary": "Member of Parliament (2001–2010)",
  "biography": "Longer biographical text…",
  "national_identity": "CZ",
  "contact_details": [
    {
      "type": "email",
      "value": "constituency@example.org"
    }
  ],
  "links": [
    {
      "url": "https://en.wikipedia.org/wiki/John_Q_Public",
      "note": "Wikipedia"
    }
  ],
  "sources": [
    {
      "url": "https://parliament.example.org/members/123"
    }
  ],
  "created_at": "2025-10-01T10:00:00Z",
  "updated_at": "2025-10-10T12:00:00Z"
}
```
