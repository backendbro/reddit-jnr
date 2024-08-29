/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { useMutation } from 'urql';
import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: UserResponse;
  createPost: Post;
  deletePost: Scalars['Boolean']['output'];
  forgotPassword: Scalars['Boolean']['output'];
  login: UserResponse;
  logout: Scalars['Boolean']['output'];
  register: UserResponse;
  updatePost?: Maybe<Post>;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};


export type MutationCreatePostArgs = {
  input: PostInput;
};


export type MutationDeletePostArgs = {
  id: Scalars['Float']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String']['output'];
  creatorId: Scalars['Float']['output'];
  id: Scalars['Float']['output'];
  points: Scalars['Float']['output'];
  text: Scalars['String']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type PostInput = {
  text: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String']['output'];
  me?: Maybe<UserResponse>;
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  id: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string } & { ' $fragmentName'?: 'RegularErrorFragment' };

export type RegularUserFragment = { __typename?: 'User', id: number, username: string } & { ' $fragmentName'?: 'RegularUserFragment' };


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: (
    { __typename?: 'UserResponse' }
    & { ' $fragmentRefs'?: { 'RegularUserResponseFragment': RegularUserResponseFragment } }
  ) };

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { 
    // { __typename?: 'UserResponse' }
    // & { ' $fragmentRefs'?: { 'RegularUserResponseFragment': RegularUserResponseFragment } }

    
      __typename?: 'UserResponse';
      errors?: Array<{ __typename?: 'FieldError'; }> | null;
      user?: { __typename?: 'User'; } | null;
    
  } };


  
export type RegularUserResponseFragment = {
  __typename?: 'UserResponse';
  errors?: Array<{ __typename?: 'FieldError'; }> | null;
  user?: { __typename?: 'User'; } | null;
};


export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type DeletePostMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };



export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;

export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };


export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register:
  //  (

  //   { __typename?: 'UserResponse' }
  //   & { ' $fragmentRefs'?: { 'RegularUserResponseFragment': RegularUserResponseFragment } }
  // ) 

  {
    __typename?: 'UserResponse';
    errors?: Array<{ __typename?: 'FieldError'; }> | null;
    user?: { __typename?: 'User'; } | null;
  }
};

export type MeQueryVariables = Exact<{ [key: string]: never; }>;
    
export type MeQuery = { __typename?: 'Query', 
  me?: {
   __typename?: 'UserResponse', 
   errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null,
    user?: RegularUserFragment | null 
    // (
      //   { __typename?: 'User' }
      //   & { ' $fragmentRefs'?: { 'RegularUserFragment': RegularUserFragment } }
      // ) 
      | null } | null }; 


export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};

export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};

export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const MeDocument = gql`
    query Me {
  me {
    errors {
      field
      message
    }
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options?: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'>) {
  return Urql.useQuery<MeQuery, MeQueryVariables>({ query: MeDocument, ...options });
};


export type PostQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type PostQuery = { __typename?: 'Query', post?: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, text: string, voteStatus?: number | null, points: number, creator: { __typename?: 'User', id: number, username: string } } | null };


export type CreatePostMutationVariables = Exact<{
  input: PostInput;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, text: string, points: number, creatorId: number } };


export type PostsQueryVariables = Exact<{
      limit: Scalars['Int']['input'];
      cursor?: InputMaybe<Scalars['String']['input']>;
}>;
    
    
// export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<{ __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, textSnippet: string, points: number, creator: { __typename?: 'User', id: number, username: string } }> } };

export const PostSnippetFragmentDoc = gql`
    fragment PostSnippet on Post {
  id
  createdAt
  updatedAt
  title
  textSnippet
  voteStatus
  points
  creator {
    id
    username
  }
}
    `;

export type PostSnippetFragment = { __typename?: 'Post', id: number, createdAt: string, updatedAt: string, title: string, textSnippet: string, voteStatus?: number | null, points: number, creator: { __typename?: 'User', id: number, username: string } } & { ' $fragmentName'?: 'PostSnippetFragment' };

export type PostsQuery = { __typename?: 'Query', posts: { __typename?: 'PaginatedPosts', hasMore: boolean, posts: Array<(
  { __typename?: 'Post' }
  & { ' $fragmentRefs'?: { 'PostSnippetFragment': PostSnippetFragment } }
)> } };

export type VoteMutationVariables = Exact<{
  value: Scalars['Int']['input'];
  postId: Scalars['Int']['input'];
}>;


export type VoteMutation = { __typename?: 'Mutation', vote: boolean };

export const VoteDocument = gql`
    mutation Vote($value: Int!, $postId: Int!) {
  vote(value: $value, postId: $postId)
}
    `;

export function useVoteMutation() {
  return Urql.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument);
};


export type UpdatePostMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  text: Scalars['String']['input'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost?: { __typename?: 'Post', id: number, title: string, text: string, textSnippet: string } | null };


export const CreatePostDocument = gql`
    mutation CreatePost($input: PostInput!) {
  createPost(input: $input) {
    id
    createdAt
    updatedAt
    title
    text
    points
    creatorId
  }
}
    `;

export function useCreatePostMutation() {
  return Urql.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument);
};


export const PostsDocument = gql`
    query Posts($limit: Int!, $cursor: String) {
  posts(limit: $limit, cursor: $cursor) {
    hasMore
    posts {
      ...PostSnippet
    }
  }
}
    ${PostSnippetFragmentDoc}`;


export function usePostsQuery(options: Omit<Urql.UseQueryArgs<PostsQueryVariables>, 'query'>) {
  return Urql.useQuery<PostsQuery, PostsQueryVariables>({ query: PostsDocument, ...options });
};


export const PostDocument = gql`
    query Post($id: Int!) {
  post(id: $id) {
    id
    createdAt
    updatedAt
    title
    text
    voteStatus
    points
    creator {
      id
      username
    }
  }
}
    `;

export function usePostQuery(options: Omit<Urql.UseQueryArgs<PostQueryVariables>, 'query'>) {
  return Urql.useQuery<PostQuery, PostQueryVariables>({ query: PostDocument, ...options });
};


export const DeletePostDocument = gql`
    mutation DeletePost($id: Int!) {
  deletePost(id: $id)
}
    `;

export function useDeletePostMutation() {
  return Urql.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument);
};



export const UpdatePostDocument = gql`
    mutation UpdatePost($id: Int!, $title: String!, $text: String!) {
      updatePost(id: $id, title: $title, text: $text) {
        id
        title
        text
        textSnippet
      }
}
    `;


export function useUpdatePostMutation() {
  return Urql.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument);
};
