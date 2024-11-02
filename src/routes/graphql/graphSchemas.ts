import {
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInputObjectType,
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

export const graphChangePostInput = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
  },
});

export const graphChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    memberTypeId: {
      type: graphsMemberTypeIdEnum,
    },
  },
});

export const graphChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
  },
});

export const graphCreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: {
      type: new GraphQLNonNull(GraphQLString),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    authorId: {
      type: new GraphQLNonNull(UUIDType),
    },
  },
});

export const graphCreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    yearOfBirth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    userId: {
      type: new GraphQLNonNull(UUIDType),
    },
    memberTypeId: {
      type: new GraphQLNonNull(graphsMemberTypeIdEnum),
    },
  },
});

export const graphCreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    balance: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

export const graphMutationsType = new GraphQLObjectType({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(graphUserType),
      args: {
        dto: {
          type: new GraphQLNonNull(graphCreateUserInput),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.user.create({
          data: _args.dto,
        });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(graphProfileType),
      args: {
        dto: {
          type: new GraphQLNonNull(graphCreateProfileInput),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.profile.create({
          data: _args.dto,
        });
      },
    },
    createPost: {
      type: new GraphQLNonNull(graphPostType),
      args: {
        dto: {
          type: new GraphQLNonNull(graphCreatePostInput),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.post.create({
          data: _args.dto,
        });
      },
    },
    changePost: {
      type: new GraphQLNonNull(graphPostType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(graphChangePostInput),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.post.update({
          where: { id: _args.id },
          data: _args.dto,
        });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(graphProfileType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(graphChangeProfileInput),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.profile.update({
          where: { id: _args.id },
          data: _args.dto,
        });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(graphUserType),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
        dto: {
          type: new GraphQLNonNull(graphChangeUserInput),
        },
      },
      resolve: async (_parent, _args, _context) => {
        return _context.prisma.user.update({
          where: { id: _args.id },
          data: _args.dto,
        });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        await _context.prisma.user.delete({
          where: {
            id: _args.id,
          },
        });
        return 'User deleted';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        await _context.prisma.post.delete({
          where: {
            id: _args.id,
          },
        });
        return 'User deleted';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        await _context.prisma.profile.delete({
          where: {
            id: _args.id,
          },
        });
        return 'User deleted';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        await _context.prisma.subscribersOnAuthors.create({
          data: {
            subscriberId: _args.userId,
            authorId: _args.authorId,
          },
        });
        return 'Subscription is successful';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: {
          type: new GraphQLNonNull(UUIDType),
        },
        authorId: {
          type: new GraphQLNonNull(UUIDType),
        },
      },
      resolve: async (_parent, _args, _context) => {
        await _context.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: _args.userId,
              authorId: _args.authorId,
            },
          },
        });
        return 'User wan unsubscribe';
      },
    },
  },
});