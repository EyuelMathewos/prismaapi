import { AbilityBuilder, Ability } from '@casl/ability'
import { User, accessTokens, Prisma } from '@prisma/client';

/**
 * @param user contains details about logged in user: its id, name, email, etc
 */
 export function defineAbilitiesFor(user: number) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  // can read blog posts
if(user==1){
  can('read', 'User');
  // can manage (i.e., do anything) own posts
  can('manage', 'User');
  // cannot delete a post if it was created more than a day ago
  cannot('delete', 'User', {
    createdAt: { $lt: Date.now() - 24 * 60 * 60 * 1000 }
  });
}

  return new Ability(rules);
};
