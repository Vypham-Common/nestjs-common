import { PipelineStage } from 'mongoose'

export function generateLookup(pipelines: GeneratePipeline[]) {
  const mappedPipeline: FacetPipelineStage[] = []
  pipelines.forEach((pipeline) => {
    const { unwind = true, keepNull = false, project } = pipeline

    if (typeof pipeline.localField === 'string') {
      const localField = `${String(pipeline.localField)}`
      const as = `${String(pipeline.as || pipeline.localField)}`
      const from = pipeline.from
      const lookupStage: PipelineStage.Lookup = {
        $lookup: {
          from: from,
          localField: localField,
          foreignField: pipeline.foreignField || '_id',
          as: as,
        },
      }
      if (pipeline.let) {
        lookupStage.$lookup.let = pipeline.let
      }
      if (pipeline.pipeline) {
        lookupStage.$lookup.pipeline = pipeline.pipeline
      }

      if (pipeline.sort) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $sort: pipeline.sort
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $sort: pipeline.sort
          }]
        }
      }

      if (pipeline.skip && Number.isInteger(pipeline.skip)) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $skip: pipeline.skip
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $skip: pipeline.skip
          }]
        }
      }

      if (pipeline.limit && Number.isInteger(pipeline.limit)) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $limit: pipeline.limit
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $limit: pipeline.limit
          }]
        }
      }

      mappedPipeline.push(lookupStage)
      if (unwind) {
        mappedPipeline.push({
          $unwind: {
            path: `$${as}`,
            preserveNullAndEmptyArrays: keepNull,
          },
        })
      }
      if (pipeline.match) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $match: pipeline.match
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $match: pipeline.match
          }]
        }
      }
      if (pipeline.lookup) {
        const nestedLookup = generateLookup(pipeline.lookup)
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push(...nestedLookup)
        } else {
          lookupStage.$lookup.pipeline = nestedLookup
        }
      }
      if (pipeline.postPipeline) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push(...pipeline.postPipeline)
        } else {
          lookupStage.$lookup.pipeline = pipeline.postPipeline
        }
      }
      if (project) {
        if (lookupStage.$lookup.pipeline) {
          lookupStage.$lookup.pipeline.push({
            $project: project
          })
        } else {
          lookupStage.$lookup.pipeline = [{
            $project: project
          }]
        }
      }
    } else {
      pipeline.localField.forEach(localField => {
        const pipelines = generateLookup([{ ...pipeline, localField }])
        mappedPipeline.push(...pipelines)
      })
    }

  })
  return mappedPipeline
}
