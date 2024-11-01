import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { MemberTypeId } from '../member-types/schemas.js';
import { UUIDType } from './types/uuid.js';

export const graphsMemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    BASIC: {
      value: MemberTypeId.BASIC,
    },
    BUSINESS: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const graphMemberType = new GraphQLObjectType({
  name: 'MemberType',
  fields: {
    id: { type: new GraphQLNonNull(graphsMemberTypeIdEnum) },
    discount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    postsLimitPerMonth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});

export const graphPostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

export const graphProfileType = new GraphQLObjectType({
  name: 'Profile',
  fields: {
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    memberType: {
      type: new GraphQLNonNull(graphMemberType),
      resolve: async (_parent, _args, _context) => {
        return await _context.prisma.memberType.findUnique({
          where: {
            id: _parent.memberTypeId,
          },
        });
      },
    },
  },
});

export const graphUserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    profile: {
      type: graphProfileType,
      resolve: async (_parent, _args, _context) => {
        return await _context.prisma.profile.findUnique({
          where: {
            userId: _parent.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphPostType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.post.findMany({
          where: {
            authorId: _parent.id,
          },
        });
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphUserType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: _parent.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphUserType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: _parent.id,
              },
            },
          },
        });
      },
    },
  }),
});

export const graphRootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphMemberType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: graphMemberType,
      args: {
        id: {
          type: new GraphQLNonNull(graphsMemberTypeIdEnum),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.memberType.findUnique({
          where: {
            id: _args.id,
          },
        });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphUserType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.user.findMany();
      },
    },
    user: {
      type: graphUserType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return await _context.prisma.user.findUnique({
          where: {
            id: _args.id,
          },
        });
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphPostType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.post.findMany();
      },
    },
    post: {
      type: graphPostType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return await _context.prisma.post.findUnique({
          where: {
            id: _args.id,
          },
        });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(graphProfileType))),
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.profile.findMany();
      },
    },
    profile: {
      type: graphProfileType,
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return await _context.prisma.profile.findUnique({
          where: {
            id: _args.id,
          },
        });
      },
    },
  },
});
