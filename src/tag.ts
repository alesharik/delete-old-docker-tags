import {SemVer, parse, rcompare} from 'semver'

export default class Tag {
  constructor(readonly original: string, readonly semver: SemVer) {}

  static parse(value: string, extractor = /v?(\d+(.\d+)*)/): Tag | null {
    const parts = extractor.exec(value)
    if (!parts) {
      return null
    }
    let ver = parts[1]
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const semver = parse(ver)
      if (!semver) {
        const p = ver.split('.').length
        if (p < 3) {
          ver += '.0'
        } else {
          return null
        }
      } else {
        return new Tag(value, semver)
      }
    }
  }

  rcompare(other: Tag): number {
    return rcompare(this.semver, other.semver)
  }
}
