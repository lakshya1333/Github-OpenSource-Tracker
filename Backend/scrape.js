import { Octokit } from "@octokit/rest";

import dotenv from "dotenv";
dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

export async function fetchUserRepos(username) {
  try {
    const response = await octokit.rest.repos.listForUser({
      username: username,
      type: 'owner', 
      sort: 'updated',
      direction: 'desc',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user repositories:', error);
    return [];
  }
}

export async function fetchUserStars(username) {
  try {
    const response = await octokit.rest.activity.listReposStarredByUser({
      username: username,
      sort: 'created',
      direction: 'desc',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stars:', error);
    return [];
  }
}

export async function fetchUserContributions(username) {
  try {
    const response = await octokit.rest.activity.listEventsForUser({
      username: username,
      per_page: 100,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    return [];
  }
}

export async function fetchUserDetails(username) {
  try {
    const response = await octokit.rest.users.getByUsername({
      username: username,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
}

export async function fetchUserPullRequests(username) { // yeh pr req ko fetch karlega
  try {
    const response = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:pr`,
      per_page: 100,
    });

    return response.data.items.map(pr => ({
      title: pr.title,
      repo: pr.repository_url.split("/").slice(-2).join("/"),
      url: pr.html_url,
      state: pr.state,
      created_at: pr.created_at,
      merged_at: pr.pull_request?.merged_at || null,
    }));
  } catch (error) {
    console.error("Error fetching user pull requests:", error);
    return [];
  }
}

export async function fetchUserIssues(username) { // yeh user ke created sare issue ko fetch karlega
  try {
    const response = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${username} type:issue`,
      per_page: 100,
    });

    return response.data.items.map(issue => ({
      title: issue.title,
      repo: issue.repository_url.split("/").slice(-2).join("/"),
      url: issue.html_url,
      state: issue.state,
      created_at: issue.created_at,
    }));
  } catch (error) {
    console.error("Error fetching user issues:", error);
    return [];
  }
}

export async function fetchUserCommits(username) { // yeh commit match karega
  try {
    const response = await octokit.rest.search.commits({
      q: `author:${username}`,
      per_page: 100,
    });

    return response.data.items.map(commit => ({
      message: commit.commit.message,
      repo: commit.repository.full_name,
      url: commit.html_url,
      date: commit.commit.author.date,
    }));
  } catch (error) {
    console.error("Error fetching user commits:", error);
    return [];
  }
}

