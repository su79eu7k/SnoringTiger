import "@testing-library/jest-dom";
import { server } from "./mocks/server";

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

HTMLCanvasElement.prototype.getContext = () => { 
    // return whatever getContext has to return
  };