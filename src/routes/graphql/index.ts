import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLBoolean } from 'graphql';
import { graphMemberType, graphPostType, graphProfileType, graphRootQueryType, graphsMemberTypeIdEnum, graphUserType } from './graphSchemas.js';

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
        contextValue: fastify
      });
    },
  });
};

const schema = new GraphQLSchema({
  query: graphRootQueryType,
  types: [graphMemberType, graphsMemberTypeIdEnum, graphUserType, graphPostType, graphProfileType],
});

export default plugin;
