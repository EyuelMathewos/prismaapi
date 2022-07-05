import { Ability } from '@casl/ability';

interface RawRule {
  action: string | string[]
  subject: string | string[]
  /** an array of fields to which user has (or not) access */
  fields?: JSON | string[] | undefined | any
  /** an object of conditions which restricts the rule scope */
  conditions?: any
  /** indicates whether rule allows or forbids something */
  inverted?: boolean
  /** message which explains why rule is forbidden */
  reason?: string
}

const defineAbilitiesFor = (rules: RawRule []) => {
  const createAbility = new Ability(rules);

  return createAbility;
};
module.exports = defineAbilitiesFor;