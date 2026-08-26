# Computer & OS Foundation — Zero-Assumption Learning Design

## Purpose

This foundation exists for learners who do not yet know what terms such as `Kernel`, `Process`, `File`, `TCP/IP stack`, or `Default Route` mean.

The curriculum must not use a technical term at the entrance and assume that a later Lab will eventually explain it. If the term is needed now, the learner needs a plain-language bridge now.

```text
Everyday role
  ↓
Technical name
  ↓
Where it sits in the system
  ↓
What breaks or becomes impossible without it
  ↓
What it is commonly confused with
  ↓
Deeper Lab when needed
```

## Learning route

```text
STEP -2  Computer and OS Foundation
  ↓
STEP -1  Financial Linux Profile
  ↓
LAB 01   Why a Web Server role is needed
  ↓
nginx as one implementation
```

STEP -2 is intentionally short. It is not a computer-science degree compressed into one page. The learner first needs a usable mental model, not CPU scheduling algorithms, page tables, or TCP congestion-control internals.

## STEP -2 — eight interactions

1. **Computer parts** — CPU / Memory / Storage / Network Interface
2. **What the OS does** — Application → OS → Hardware
3. **Kernel** — the central OS layer that manages resources
4. **Program vs Process** — stored instructions vs a running instance
5. **File / Directory / Path** — data, container, and address
6. **Network address and exit** — IP / Subnet / Default Route / DNS / Port
7. **Server / Service / Port** — role, running process, and managed operation
8. **Boot flow** — Firmware → Bootloader → Kernel → systemd → Service

After all eight interactions, a three-question check confirms only the essential relationships:

- Program started and currently running = Process
- Default Route = the normal exit for destinations outside the local network
- nginx = one Application that implements the Web Server role

Completion key:

```text
linux_computer_os_foundation_complete
```

The foundation is recommended, not counted as one of the 20 Linux Labs.

## Adaptive explanation levels

The same content must support a complete beginner and an experienced reader.

### 完全未経験 / Beginner

- default for a new browser
- technical terms become clickable
- a short everyday-language meaning is shown beside the term
- STEP -2 opens automatically until completed

Example:

```text
Kernel  OSの司令塔
Default Route  近所以外へ出る基本の出口
```

### 標準 / Standard

- technical terms remain clickable
- the everyday-language label is hidden until the learner opens the term
- STEP -2 remains available but does not force itself open

### 説明最小 / Compact

- inline term decoration is removed
- the small glossary launcher remains available
- STEP -2 stays collapsed unless opened explicitly

Preference key:

```text
fit_explanation_level_v1
```

## Shared glossary contract

Each term entry contains:

1. technical label
2. everyday-language label
3. one-paragraph explanation
4. system position
5. what becomes difficult without it
6. common confusion
7. optional STEP -2 reference

The shared glossary is loaded in:

- Root learning home
- Linux
- SQL / Database
- COBOL
- JCL / Batch
- Cloud Fundamentals
- AWS
- Google Cloud
- Azure
- Field Incident Gate
- Financial War Room

It covers the first layer of Computer / OS / Network terminology and selected cross-curriculum terms such as DBMS, Transaction, Compiler, JCL, JES, VM, VPC/VNet, IAM, API, CLI, and Evidence.

## Decoration boundaries

Automatic term support must never rewrite:

- code or command examples
- terminals and consoles
- links and buttons
- form inputs
- the glossary itself
- the foundation diagrams

Only a limited number of first occurrences are decorated per rendered area. This prevents the beginner mode from becoming another wall of labels.

## Linux profile relationship

The foundation teaches Common Linux concepts before Distribution-specific operations.

```text
Computer / OS Foundation
Hardware / OS / Kernel / Process / File / Network
  ↓
Common Linux
systemd / Port / Log / Evidence
  ↓
Distribution Profile
RHEL reference / Ubuntu / SLES / Oracle Linux
  ↓
Product role
Web Server
  ↓
Product implementation
nginx / Apache / Application server
```

The Linux profile selector remains important, but a first-time learner should be able to see STEP -2 before being forced to choose a Distribution. The profile is selected when moving into STEP -1 or a Lab.

## What this foundation does not claim

- It does not teach all OS internals.
- It does not make the learner a Linux administrator by itself.
- It does not guarantee that a machine has working networking merely because an OS is installed.
- It does not treat a glossary definition as equivalent to operational skill.
- It does not replace the evidence-based Labs and War Rooms.

The target is simpler and more useful:

> When an unfamiliar term appears, the learner can place it in the system, explain its role in ordinary language, and know which deeper Lab to open next.
