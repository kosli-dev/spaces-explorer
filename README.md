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

## Deployment

### Deploying to AWS S3 (Recommended)

This is a static single-page application, making it perfect for hosting on AWS S3 with CloudFront:

1. Build the application locally:
   ```bash
   npm install
   npm run build
   ```

2. Create an S3 bucket in your AWS account with a unique name:
   ```bash
   aws s3 mb s3://your-spaces-explorer-bucket
   ```

3. Configure the bucket for static website hosting:
   ```bash
   aws s3 website s3://your-spaces-explorer-bucket --index-document index.html --error-document index.html
   ```

4. Set bucket policy to allow public access (if it's a public site):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-spaces-explorer-bucket/*"
       }
     ]
   }
   ```

5. Upload the build folder to S3:
   ```bash
   aws s3 sync build/ s3://your-spaces-explorer-bucket
   ```

6. (Optional) Set up CloudFront for faster global access and HTTPS.

Your application will be available at: `http://your-spaces-explorer-bucket.s3-website-[region].amazonaws.com`

### Deploying with Docker

You can build and run the Docker image locally:

```bash
# Build the Docker image
docker build -t spaces-explorer .

# Run the container
docker run -p 8080:8080 spaces-explorer
```

Then access the application at http://localhost:8080


## License

This project is licensed under the MIT License.
