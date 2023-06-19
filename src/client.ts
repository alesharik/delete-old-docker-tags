import axios from 'axios'

const ACCEPT_HEADER: string = [
  'application/vnd.docker.distribution.manifest.v2+json',
  'application/vnd.docker.distribution.manifest.list.v2+json'
].join(';')

export class DockerRegistryClient {
  constructor(
    private readonly registry: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  async getTags(repository: string): Promise<string[]> {
    return (
      await axios({
        method: 'GET',
        url: `${this.registry}/v2/${repository}/tags/list`,
        auth: {
          username: this.username,
          password: this.password
        },
        headers: {
          Accept: ACCEPT_HEADER
        }
      })
    ).data.tags
  }

  async getManifestDigest(repository: string, tag: string): Promise<string> {
    return (
      await axios({
        method: 'GET',
        url: `${this.registry}/v2/${repository}/manifests/${tag}`,
        auth: {
          username: this.username,
          password: this.password
        },
        headers: {
          Accept: ACCEPT_HEADER
        }
      })
    ).headers['docker-content-digest']
  }

  async deleteManifest(repository: string, digest: string): Promise<void> {
    await axios({
      method: 'DELETE',
      url: `${this.registry}/v2/${repository}/manifests/${digest}`,
      auth: {
        username: this.username,
        password: this.password
      },
      headers: {
        Accept: ACCEPT_HEADER
      }
    })
  }
}
