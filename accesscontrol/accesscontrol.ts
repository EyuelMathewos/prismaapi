import { User, accessTokens , Prisma } from '@prisma/client';
import { AbilityClass, AbilityBuilder, subject } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';

type AppAbility = PrismaAbility<[string, Subjects<{
  User: User,
  accessTokens: accessTokens
}>]>;
const AppAbility = PrismaAbility as AbilityClass<AppAbility>;
const { can, cannot, build } = new AbilityBuilder(AppAbility);

can('read', 'User', { id: "1" });
// cannot('read', 'accessTokens', { title: { startsWith: '[WIP]:' } });

const ability = build();
ability.can('read', 'User');
// ability.can('read', subject('accessTokens', { title: '...', authorId: 1 })));