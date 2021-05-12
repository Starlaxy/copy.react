export const getProject = async () => {
    const res = await fetch('http://localhost:8000/project/', {
      method: "GET",
    });
    return await res.json();
  };