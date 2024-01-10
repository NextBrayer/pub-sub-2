import * as z from "zod";

interface configuration {
  SourceType: string;
  SourceData: SourceData;
  DestinationType: string;
  DestinationData: DestinationData;
}

interface SourceData {
  url: string;
  topic: string;
}

interface DestinationData {
  url: string;
  topic: string;
}

interface configurationId extends configuration {
  id: number;
}
const ConfigurationSchema = z.object({
  SourceType: z.string().min(1),
  SourceData: z.object({
    url: z.string().min(5),
    topic: z.string().min(1),
  }),
  DestinationType: z.string().min(1),
  DestinationData: z.object({
    url: z.string().min(5),
    topic: z.string().min(1),
  }),
});


export {
  ConfigurationSchema,
  configuration,
  configurationId,
  SourceData,
  DestinationData,
};