import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach( async ({page}) => {
  await page.route('https://conduit-api.bondaracademy.com/api/tags', async route =>{
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })
  await page.goto('https://conduit.bondaracademy.com/')
  await page.getByText('Sign In').click()
  await page.getByRole('textbox', {name: "Email"}).fill('blandino@test.com')
  await page.getByRole('textbox', {name: "Password"}).fill('1111')
  await page.getByRole('button').click()

  await page.waitForTimeout(1000)
})

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route =>{
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is a MOCK test title"
    responseBody.articles[0].description = "This is a MOCK test description"

    await route.fulfill({
      body: JSON.stringify(responseBody)
    })

  })

  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK test description')
});

test('delete article', async ({ page, request }) => {
  const responce = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user":{"email":"blandino@test.com","password":"1111"}
    }
  })
  const responceBody = await responce.json()
  const accessToken = responceBody.user.token

  const articleResponce = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"This is a test article","description":"This is a test description","body":"This is test body","tagList":[]}
    },
    headers: {
      Authorization:`Token ${accessToken}`
    }
  })
  expect (articleResponce.status()).toEqual(201)

  await page.getByText('Global Feed').click()
  await page.getByText('This is a test article').click()
  await page.getByRole('button', {name: "Delete Article"}).first().click()
  await page.getByText('Global Feed').click()

  await expect(page.locator('app-article-list h1').first()).not.toContainText('This is a test article')
})

