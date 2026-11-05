export function measurePayload(data: { name: string }[]) {
  let payloadKb = 0;

  data.forEach((country) => {
    const jsonString = JSON.stringify(data);
    const payloadBytes = new TextEncoder().encode(jsonString).length;

    payloadKb += payloadBytes / 1024;
  });

  return Number(payloadKb.toFixed(2));
}
