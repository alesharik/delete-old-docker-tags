import {expect, test} from '@jest/globals'
import Tag from '../src/tag'
import {} from 'semver'

test('parses semver variants', async () => {
  expect(Tag.parse('v1.1.1')?.semver?.version).toEqual('1.1.1')
  expect(Tag.parse('v1.1.1-dev')?.semver?.version).toEqual('1.1.1')
  expect(Tag.parse('1.1.1')?.semver?.version).toEqual('1.1.1')
  expect(Tag.parse('test-1.1.1')?.semver?.version).toEqual('1.1.1')
  expect(Tag.parse('1')?.semver?.version).toEqual('1.0.0')
  expect(Tag.parse('1.1')?.semver?.version).toEqual('1.1.0')
})

test('fails to parse tags without semver', async () => {
  expect(Tag.parse('latest')).toBeNull()
  expect(Tag.parse('dev')).toBeNull()
})

test('sorts tags by desceding order', async () => {
  expect(
    ['1', '1.1', '1.1.1', '1.1.2', '2']
      .map(value => Tag.parse(value))
      .filter((value): value is Tag => value !== null)
      .sort((a, b) => a.rcompare(b))
      .map(value => value.original)
  ).toStrictEqual(['2', '1.1.2', '1.1.1', '1.1', '1'])
})
