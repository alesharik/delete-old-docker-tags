<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Delete old github tags

GitHub action to delete old tags from docker registry.

It will:
1. Fetch all tags for specified image
2. Extract semver versions from them. **If extraction fails, tag will be ignored (so `latest` and other tags like it will be safe)**
3. Sort extracted versions in descending order
4. Deletes all tags below `keep-last` position in sorted list. **This deletes manifests too, so if deleted tag points to `latest` manifest, these two tags will be deleted**

### Inputs

| Name                | Description                              | Required           | Default          |
|---------------------|------------------------------------------|--------------------|------------------|
| `registry`          | Registry URL (with http/https)           | :heavy_check_mark: |                  |
| `username`          | Username to login into registry          | :heavy_check_mark: |                  |
| `password`          | Password to login into registry          | :heavy_check_mark: |                  |
| `repository`        | Repository/image name to fetch tags from | :heavy_check_mark: |                  |
| `keep-last`         | How much versions to keep                |                    | `10`             |
| `version-extractor` | Regex to extract SemVer version from tag |                    | `v?(\d+(.\d+)*)` |

### Example usage

> Keep 10 last versions of image

```yaml
uses: alesharik/delete-old-docker-tags@v0.0.2
with:
  registry: https://registry.url
  username: ${{ secrets.DOCKER_USERNAME }}
  password: ${{ secrets.DOCKER_PASSWORD }}
  repository: test
```

> Keep 5 last versions of image

```yaml
uses: alesharik/delete-old-docker-tags@v0.0.2
with:
  registry: https://registry.url
  username: ${{ secrets.DOCKER_USERNAME }}
  password: ${{ secrets.DOCKER_PASSWORD }}
  repository: test
  keep-last: 5
```


> Keep 5 last versions of dev images

```yaml
uses: alesharik/delete-old-docker-tags@v0.0.2
with:
  registry: https://registry.url
  username: ${{ secrets.DOCKER_USERNAME }}
  password: ${{ secrets.DOCKER_PASSWORD }}
  repository: test
  keep-last: 5
  version-extractor: 'v?(\d+(.\d+)*)-dev'
```
