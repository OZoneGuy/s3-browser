// import type { Tree } from "./dir-tree";
// import { dirTree } from "./dir-tree";
import { describe, expect, it } from 'vitest'
import { normalizePath } from './dir-tree'

describe('dir-tree', () => {
  it('should normalize the path', () => {
    const path: string[] = ['a', 'b', 'c']

    expect(normalizePath(path)).toEqual('a/b/c')
  })

  it('should return an empty string for an empty path', () => {
    const path: string[] = []

    expect(normalizePath(path)).toEqual('')
  })

  it('should normalize a string path', () => {
    const path = 'docs'

    expect(normalizePath(path)).toEqual('docs')
  })
})
