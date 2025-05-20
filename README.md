## Requirements
- Node.js >=18.3.0
- A GitHub token with permissions `read:project` authorized for the organization the project lives in
- Project ID - to get one follow those steps:
  1. Get project number from project URL (e.g `1234` is the number for https://github.com/orgs/foo/projects/1234)
  2. Go to [GitHub GraphQL explorer](https://docs.github.com/en/graphql/overview/explorer)
  3. Execute the following query, where `org_name` is the organization name and `project_number` is the project number:
  ```graphql
  query {
  organization(login: "org_name") {
  projectV2(number: project_number) {
    id
  }
  }
  }
  ```
  4. You will get a response like this - `id` is your project ID.
  ```graphql
  {
  "data": {
    "organization": {
      "projectV2": {
        "id": "PVT_awfakeDOAGc3Zs4AJTXv"
      }
    }
  }
  }
  ```
## Usage
Clone this repository and run the following command while in the repository directory:
```bash
npm start -- --github_token=token --project_id=projectid
```
This will create a CSV file in the same directory.