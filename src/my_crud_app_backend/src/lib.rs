use candid::{CandidType, Deserialize};
use ic_cdk::api::time;
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct Task {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub completed: bool,
    pub created_at: u64,
    pub updated_at: u64,
}

#[derive(CandidType, Deserialize)]
pub struct CreateTaskInput {
    pub title: String,
    pub description: String,
}

#[derive(CandidType, Deserialize)]
pub struct UpdateTaskInput {
    pub title: Option<String>,
    pub description: Option<String>,
    pub completed: Option<bool>,
}

type TaskId = u64;
type TaskStore = HashMap<TaskId, Task>;

thread_local! {
    static TASKS: RefCell<TaskStore> = RefCell::new(HashMap::new());
    static NEXT_ID: RefCell<TaskId> = RefCell::new(1);
}

// Create a new task
#[update]
fn create_task(input: CreateTaskInput) -> Task {
    let id = NEXT_ID.with(|next_id| {
        let current_id = *next_id.borrow();
        *next_id.borrow_mut() = current_id + 1;
        current_id
    });

    let task = Task {
        id,
        title: input.title,
        description: input.description,
        completed: false,
        created_at: time(),
        updated_at: time(),
    };

    TASKS.with(|tasks| {
        tasks.borrow_mut().insert(id, task.clone());
    });

    task
}

// Read all tasks
#[query]
fn get_all_tasks() -> Vec<Task> {
    TASKS.with(|tasks| {
        tasks.borrow().values().cloned().collect()
    })
}

// Read a specific task
#[query]
fn get_task(id: TaskId) -> Option<Task> {
    TASKS.with(|tasks| {
        tasks.borrow().get(&id).cloned()
    })
}

// Update a task
#[update]
fn update_task(id: TaskId, input: UpdateTaskInput) -> Option<Task> {
    TASKS.with(|tasks| {
        let mut tasks = tasks.borrow_mut();
        if let Some(task) = tasks.get_mut(&id) {
            if let Some(title) = input.title {
                task.title = title;
            }
            if let Some(description) = input.description {
                task.description = description;
            }
            if let Some(completed) = input.completed {
                task.completed = completed;
            }
            task.updated_at = time();
            Some(task.clone())
        } else {
            None
        }
    })
}

// Delete a task
#[update]
fn delete_task(id: TaskId) -> bool {
    TASKS.with(|tasks| {
        tasks.borrow_mut().remove(&id).is_some()
    })
}

// Get task count
#[query]
fn get_task_count() -> u64 {
    TASKS.with(|tasks| tasks.borrow().len() as u64)
}

// Clear all tasks (for testing)
#[update]
fn clear_all_tasks() -> bool {
    TASKS.with(|tasks| {
        tasks.borrow_mut().clear();
    });
    NEXT_ID.with(|next_id| {
        *next_id.borrow_mut() = 1;
    });
    true
}

// Generate Candid interface
ic_cdk::export_candid!();