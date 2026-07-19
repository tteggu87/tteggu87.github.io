import assert from "node:assert"
import test, { describe } from "node:test"
import type { QuartzComponentProps } from "../../components/types"
import { getCondition } from "./conditions"

const propsFor = (slug: string) =>
  ({
    fileData: { slug },
  }) as QuartzComponentProps

describe("built-in layout conditions", () => {
  test("index and not-index are complementary", () => {
    const index = getCondition("index")
    const notIndex = getCondition("not-index")

    assert.ok(index)
    assert.ok(notIndex)
    assert.equal(index(propsFor("index")), true)
    assert.equal(notIndex(propsFor("index")), false)
    assert.equal(index(propsFor("notes/example")), false)
    assert.equal(notIndex(propsFor("notes/example")), true)
  })
})
