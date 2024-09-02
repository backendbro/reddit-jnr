import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: ["src/graphql/mutations/*.graphql", "src/graphql/queries/*.graphql", "src/graphql/fragments/*.graphql"], 
  generates: {
    "src/generated/types.ts": {
      //preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ]
    }
  }
};

export default config; 
