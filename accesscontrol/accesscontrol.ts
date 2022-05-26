// import { User, accessTokens, Prisma } from '@prisma/client';
// import { AbilityClass, AbilityBuilder, subject } from '@casl/ability';
// import { PrismaAbility, Model } from '@casl/prisma';

// type AppAbility = PrismaAbility<[string, Models<{
//   User: User,
//   accessTokens: accessTokens
// }>]>;
// const AppAbility = PrismaAbility as AbilityClass<AppAbility>;
// const { can, cannot, build } = new AbilityBuilder(AppAbility);

// can('read', 'Post', { authorId: 1 });
// cannot('read', 'Post', { title: { startsWith: '[WIP]:' } });

// const ability = build();
// ability.can('read', 'Post');
// ability.can('read', subject('Post', { title: '...', authorId: 1 })));