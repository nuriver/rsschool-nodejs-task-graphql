import DataLoader from 'dataloader';

export function createProfileLoader(prisma) {
  return new DataLoader(async (userIds) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds } },
    });

    const profileMap = new Map();
    profiles.forEach((profile) => {
      if (!profileMap.has(profile.userId)) {
        profileMap.set(profile.userId, []);
      }
      profileMap.get(profile.userId).push(profile);
    });

    return userIds.map((id) => profileMap.get(id) || []);
  });
}

export function createUserLoader(prisma) {
  return new DataLoader(async (userIds) => {
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    return userIds.map((id) => userMap.get(id));
  });
}

export function createPostLoader(prisma) {
  return new DataLoader(async (authorIds) => {
    const posts = await prisma.post.findMany({
      where: { authorId: { in: authorIds } },
    });

    const postMap = new Map();
    posts.forEach((post) => {
      if (!postMap.has(post.authorId)) {
        postMap.set(post.authorId, []);
      }
      postMap.get(post.authorId).push(post);
    });

    return authorIds.map((id) => postMap.get(id) || []);
  });
}

export function createMemberTypeLoader(prisma) {
  return new DataLoader(async (ids) => {
    const memberTypes = await prisma.memberType.findMany({
      where: { id: { in: ids } },
    });

    const memberTypeMap = new Map();
    memberTypes.forEach((memberType) => {
      memberTypeMap.set(memberType.id, memberType);
    });

    return ids.map((id) => memberTypeMap.get(id) || null);
  });
}