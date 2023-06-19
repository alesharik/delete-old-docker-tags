import {expect, test} from '@jest/globals'
import {DockerRegistryClient} from '../src/client'

const REGISTRY = 'http://localhost:5000'
const USERNAME = 'testuser'
const PASSWORD = 'testpassword'
const REPOSITORY = 'test'

test('gets all tags', async () => {
  const client = new DockerRegistryClient(REGISTRY, USERNAME, PASSWORD)
  const tags = await client.getTags(REPOSITORY)
  expect(tags.length).toBeGreaterThan(0)
  tags.forEach(v => expect(v).toMatch(/v1\.\d/))
})

test('gets tag manifest', async () => {
  const client = new DockerRegistryClient(REGISTRY, USERNAME, PASSWORD)
  const tags = await client.getTags(REPOSITORY)
  await expect(client.getManifestDigest(REPOSITORY, tags[0])).resolves.toMatch(
    /.*/
  )
})

test('deletes tag', async () => {
  const client = new DockerRegistryClient(REGISTRY, USERNAME, PASSWORD)
  const tags = await client.getTags(REPOSITORY)
  const firstDigest = await client.getManifestDigest(REPOSITORY, tags[0])
  await client.deleteManifest(REPOSITORY, firstDigest)
  await expect(client.getTags(REPOSITORY)).resolves.not.toContain(tags[0])
})
