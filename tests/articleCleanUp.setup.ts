import { test as setup, expect } from '@playwright/test';

setup('delete article', async ({request}) =>{
    const deleteArticleResponce = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`)
     
       expect (deleteArticleResponce.status()).toEqual(204)
})