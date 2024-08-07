import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export const encodeEasScore = (
  plaintiff: number,
  defendant: number,
  name: string
): string => {
  const schemaEncoder = new SchemaEncoder(
    "uint8 plaintiff,uint8 defendant,string comments"
  );
  const encodedData = schemaEncoder.encodeData([
    { name: "plaintiff", value: plaintiff, type: "uint8" },
    { name: "defendant", value: defendant, type: "uint8" },
    { name: "comments", value: name, type: "string" },
  ]);

  return encodedData;
};
