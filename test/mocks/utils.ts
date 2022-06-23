import { faker } from '@faker-js/faker';

export function mockId(vals?: { id?: number }) {
  return vals?.id || faker.datatype.number(10000);
}
