# Spaces Explorer

A hierarchical space exploration prototype for visualizing organizational resource hierarchies.

## Features

- Load hierarchical JSON data via file upload
- Browse spaces in a nested tree view
- View aggregated resources (environments, flows, policies, attestation types)
- Resource paths show the full location of each resource in the hierarchy

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Upload a JSON file with your hierarchy data using the "Load Hierarchy" option
   - You can use the included sample data (bigbankinc-hierarchy.json)
2. Browse the spaces in the left navigation panel
3. Click on any space to set it as the current context
4. Use the resource type menu items to view different resource types (environments, flows, etc.)

## JSON Format

The application expects a JSON file with the following structure:

```json
{
  "org": "OrganizationName",
  "spaces": [
    {
      "name": "RootSpace",
      "environments": ["ENV1", "ENV2"],
      "flows": ["FLOW1", "FLOW2"],
      "env_policies": ["POLICY1", "POLICY2"],
      "attestation_types": ["TYPE1", "TYPE2"],
      "spaces": [
        {
          "name": "ChildSpace",
          // ...and so on
        }
      ]
    }
  ]
}
```

Each space can contain:
- A name
- Arrays of resources (environments, flows, env_policies, attestation_types)
- Nested child spaces

## Contributing

This project is a prototype for exploring hierarchical spaces. Contributions and suggestions are welcome!

## License

This project is licensed under the MIT License.