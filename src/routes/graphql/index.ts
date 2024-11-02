import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import {
  graphChangePostInput,
  graphChangeProfileInput,
  graphChangeUserInput,
  graphCreatePostInput,
  graphCreateProfileInput,
  graphCreateUserInput,
  graphMemberType,
  graphMutationsType,
  graphPostType,
  graphProfileType,
  graphRootQueryType,
  graphsMemberTypeIdEnum,
  graphUserType,
} from './graphSchemas.js';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      return graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: fastify,
      });
    },
  });
};

const schema = new GraphQLSchema({
  query: graphRootQueryType,
  mutation: graphMutationsType,
  types: [
    UUIDType,
    graphsMemberTypeIdEnum,
    graphMemberType,
    graphPostType,
    graphProfileType,
    graphUserType,
    graphChangePostInput,
    graphChangeProfileInput,
    graphChangeUserInput,
    graphCreatePostInput,
    graphCreateProfileInput,
    graphCreateUserInput,
  ],
});

export default plugin;
