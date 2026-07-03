import { api } from "../../lib/api";

function TestApiButton() {
  async function testHealth() {
    try {
      const res = await api.get("/health");
      console.log(res);
      alert("Backend connected");
    } catch (err) {
      console.error(err);
      alert("Backend connection failed");
    }
  }

  return <button onClick={testHealth}>Test Backend</button>;
}

export default TestApiButton;
