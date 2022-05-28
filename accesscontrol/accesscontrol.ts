import { AbilityBuilder, Ability, ForbiddenError  } from '@casl/ability'

import { User, accessTokens, Prisma } from '@prisma/client';

//ForbiddenError.setDefaultMessage(() => "Default error message");

 export function defineAbilitiesFor(user: number) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

//Admin
if(user==1){
  can('read', 'User');
  can('create', 'User');
  can('update', 'User');
  cannot('delete', 'User');

  can('read', 'Item');
  can('create', 'Item');
  can('update', 'Item');
  cannot('delete', 'Item');

  can('read', 'Order');
  can('create', 'Order');
  can('update', 'Order');
  cannot('delete', 'Order');
}
//customer
if(user==2){
  can('read', 'User');
  can('create', 'User');
  can('update', 'User');


  can('read', 'Item');


  can('read', 'Order');
  can('create', 'Order');
  can('update', 'Order');
}
//Organization
if(user==3){
  can('read', 'User');
  can('create', 'User');
  can('update', 'User');


  can('read', 'Item');
  can('create', 'Item');
  can('update', 'Item');

  can('read', 'Order');
}
//Unauthenticated
else {
  can('create', 'User');
  can('read', 'Item');
}
let ability = new Ability(rules)


  return ability;
};