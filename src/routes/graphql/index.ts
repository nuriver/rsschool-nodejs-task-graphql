import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { graphql, GraphQLSchema, validate, parse } from 'graphql';
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
import depthLimit from 'graphql-depth-limit';
import {
  createMemberTypeLoader,
  createPostLoader,
  createProfileLoader,
  createUserLoader,
} from './loaders.js';

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
    async handler(req, reply) {
      const query = req.body.query;
      const ast = parse(query);
      const validationErrors = validate(schema, ast, [depthLimit(5)]);

      if (validationErrors.length > 0) {
        reply.status(400).send({
          errors: validationErrors.map((error) => ({ message: error.message })),
        });
        return;
      }

      const profileLoader = createProfileLoader(prisma);
      const postLoader = createPostLoader(prisma);
      const userLoader = createUserLoader(prisma);
      const memberLoader = createMemberTypeLoader(prisma);

      return graphql({
        schema: schema,
        source: req.body.query,
        variableValues: req.body.variables,
        contextValue: { prisma, profileLoader, postLoader, userLoader, memberLoader },
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
