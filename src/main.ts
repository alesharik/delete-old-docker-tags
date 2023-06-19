import * as core from '@actions/core'
import {DockerRegistryClient} from './client'

async function deleteTag(
  client: DockerRegistryClient,
  repository: string,
  tag: string
): Promise<void> {
  core.warning(`Deleting ${tag} tag`)
  try {
    const manifest = await client.getManifestDigest(repository, tag)
    await client.deleteManifest(repository, manifest)
    core.info(`Tag ${tag} deleted`)
  } catch (e) {
    core.error(e as Error)
    throw e
  }
}

async function run(): Promise<void> {
  try {
    const username = core.getInput('username')
    const password = core.getInput('password')
    const registry = core.getInput('registry')
    const repository = core.getInput('repository')
    const toKeep = parseInt(core.getInput('keep-last'))
    const versionExtractor = new RegExp(core.getInput('version-extractor'))

    if (isNaN(toKeep)) {
      core.setFailed('Please be sure to set input "keep-last" as a number')
      return
    }

    const client = new DockerRegistryClient(registry, username, password)
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
      (
        await client.getTags(repository)
      )
        .map(tag => versionExtractor.exec(tag))
        .filter((groups): groups is RegExpExecArray => groups !== null)
        .map(groups => groups[1])
        .sort()
        .reverse()
        .slice(toKeep)
        .map(async tag => deleteTag(client, repository, tag))
    )

    core.setOutput('success', true)
  } catch (error) {
    core.setFailed((error as Error).message)
  }
}

run()
