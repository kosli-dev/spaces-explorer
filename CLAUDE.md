# CLAUDE.md - Agent Guidelines for Spaces Explorer

## Build/Lint/Test Commands
- Build: `npm run build` 
- Lint: `npm run lint`
- Test (all): `npm test`
- Test (single): `npm test -- -t "test name pattern"`
- Start development server: `npm start`

## Code Style Guidelines
- **Formatting**: Use JSON for data files, markdown for documentation
- **Naming**:
  - Use camelCase for variables and functions
  - Spaces/environments use consistent hierarchical naming (e.g., FX-CRYPTO-DEV)
  - Flows follow kebab-case format (e.g., fx-crypto-trading-engine-ci)
- **JSON Structure**: Follow the established hierarchical structure for resource organization:
  - org → spaces → spaces/environments/flows/policies
  - Include relevant attributes: environments, flows, env_policies, attestation_types
- **Documentation**: Use clear hierarchical markdown with consistent indentation
- **Error Handling**: Validate structure against schema before operations

## Repository Structure
This repository contains code for a Spaces Explorer application, which visualizes and manages hierarchical resources in the BigBankInc organization.