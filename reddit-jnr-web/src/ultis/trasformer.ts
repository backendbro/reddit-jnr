import { FieldError } from "../generated/graphql";

export const transformErrors = (errors: Array<{ __typename?: "FieldError"; field?: string; message?: string }> | null): FieldError[] => {
  

    if (!errors) {
        return[] 
    }
    
    return errors.map(err => ({
      field: err.field || '',
      message: err.message || ''
    }));
    
};

