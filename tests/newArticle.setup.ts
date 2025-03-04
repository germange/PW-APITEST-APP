import { test as setup, expect } from '@playwright/test';

setup('create new article', async ({request}) =>{
      const articleResponce = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
          "article":{"title":"Likes test article","description":"This is a test description","body":"This is test body","tagList":[]}
        }
      })
      expect (articleResponce.status()).toEqual(201)
      const responce = await articleResponce.json()
      const slugId = responce.article.slug
      process.env['SLUGID'] = slugId
})