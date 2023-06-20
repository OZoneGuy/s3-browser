import type { Tree } from "./dir-tree";
import { dirTree } from "./dir-tree";
import { describe, expect, it } from "vitest";

describe("dir-tree", () => {
    it("should return a Tree from a list of paths", () => {
        const paths = [
            "foo/bar",
            "baz/qux",
            "test"
        ];
        const expected: Tree = {
            foo: {
                bar: {}
            },
            baz: {
                qux: {}
            },
            test: {}
        }

        expect(dirTree(paths)).toEqual(expected);
    });

    it("should merge overlapping paths", () => {
        const paths = [
            "foo/bar",
            "foo/baz",
            "foo/bar/baz"
        ];
        const expected: Tree = {
            foo: {
                bar: {
                    baz: {}
                },
                baz: {}
            }
        }

        expect(dirTree(paths)).toEqual(expected);
    });
});
