
//* Helper para retrasar peticion por los segundos que especifiquemos 
export const sleep = (seconds: number = 1): Promise<boolean> => {

  return new Promise((resolve) => { 
    setTimeout(() => {
      resolve(true)
    },seconds * 1000);
  })
}