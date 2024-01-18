import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class SseUtilityService {
  async postSseEvent(
    url: string,
    body: any,
    token: string,
    controller: AbortController,
    onopen: (value: any, response: Response) => void,
    onclose: (value: any, response: Response) => void,
    onmessage: (value: any, response: Response) => void,
    onerror: (err: any) => void
  ) {
    try {
      const signal = controller.signal;
      const response: Response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/event-stream",
          Authorization: `Bearer ` + token,
        },
        body: JSON.stringify(body),
        signal: signal,
      });
      const reader = response?.body
        ?.pipeThrough(new TextDecoderStream())
        .getReader();

      let isOpen = true;
      let prevData = "";

      while (true) {
        if (reader) {
          const { value, done } = await reader.read();

          const data = this.getData((prevData.trim() + value) as string);
          prevData = data.data;

          if (isOpen) {
            onopen(data.data, response);
            isOpen = false;
          }
          if (data && !data.isPrepend) {
            prevData = "";
            onmessage(data.data, response);
          }

          if (done) {
            onclose(data.data, response);
            break;
          }
        }
      }
    } catch (err) {
      onerror(err);
    }
  }

  private getData(value: string) {
    let jsonData = "";
    let jsonStringArray = value
      ?.split("\n")
      .filter((item) => item.trim() != "");

    if (jsonStringArray && jsonStringArray.length > 0) {
      const jsonDataString = jsonStringArray[jsonStringArray.length - 1].trim();
      jsonData =
        jsonDataString.startsWith("data:") && jsonDataString.endsWith("}")
          ? '{"data":' + jsonDataString.replace("data:", "") + "}"
          : jsonDataString;
    }
    const processAsJson = jsonData.startsWith("{") && jsonData.endsWith("}");
    return {
      isPrepend: !processAsJson,
      data: processAsJson ? JSON.parse(jsonData) : jsonData,
    };
  }
}
