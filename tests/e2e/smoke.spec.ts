import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Make room for what matters." })).toBeVisible();
});

test("tasks can be added, completed, and filtered", async ({ page }) => {
  await page.goto("/");
  const taskInput = page.getByRole("textbox", { name: "New task" });

  await taskInput.fill("Write a project update");
  await taskInput.press("Enter");
  await taskInput.fill("Take a short walk");
  await taskInput.press("Enter");

  await expect(page.getByRole("listitem")).toHaveCount(2);
  await page.getByRole("checkbox", { name: "Mark Write a project update done" }).check();
  await page.getByRole("button", { name: "Active" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByText("Take a short walk")).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(1);
  await expect(page.getByText("Write a project update")).toBeVisible();
  await page.getByRole("button", { name: "All" }).click();
  await expect(page.getByRole("listitem")).toHaveCount(2);

  await page.getByRole("checkbox", { name: "Complete all tasks" }).check();
  await expect(page.getByText("0 tasks left")).toBeVisible();
  await page.getByRole("checkbox", { name: "Mark all tasks active" }).uncheck();
  await expect(page.getByText("2 tasks left")).toBeVisible();
});

test("health endpoint is ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toMatchObject({ status: "ok" });
});
