let elementDataPromise;

window.getElementData = () => {
  if (!elementDataPromise) {
    elementDataPromise = fetch("data/elements-index.json", { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load element index");
        return response.json();
      })
      .then((elements) => {
        if (!Array.isArray(elements) || elements.length !== 118) {
          throw new Error("Periodic table requires exactly 118 elements");
        }
        return elements;
      });
  }

  return elementDataPromise;
};
