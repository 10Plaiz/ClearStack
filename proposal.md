**`SIKAPTala 2026: The National CS & IT Competition`**  
**`IDEATHON: SOFTWARE DEVELOPMENT PROPOSAL GUIDE`**

                     **`SIKAPTala 2026: Hackathon Competition`**  
                        **`ClearStack`**  
**`by Silakbo`**

**`I. Rationale`**

	`AI-assisted development has quickly become part of how students, beginner developers, and hackathon teams build software. Stack Overflow's 2025 Developer Survey reports that 84% of respondents use or plan to use AI tools in their development process, and 51% of professional developers use AI tools daily (Stack Overflow, 2025). This shows that AI tools are no longer an experimental add-on, they are already part of modern software work.`

`However, the same survey also shows that many developers remain cautious about AI output. Forty-six percent of respondents distrust the accuracy of AI tools, while only 33% trust it. Developers also reported common frustrations, including AI answers that are "almost right, but not quite" and the extra time needed to debug AI-generated code (Stack Overflow, 2025). For beginner builders, this problem is more serious because they may not yet have enough experience to judge whether an AI suggestion fits their project, follows their scope, or introduces risks.`

`This challenge is not only about code correctness. It is also about project setup. Many beginner builders start using AI before clearly defining what the project is, what the AI should know, what the AI should avoid, and how decisions should be documented. Some copy large prompt packs, online workflows, or tool instructions from other projects without knowing if those instructions match their actual stage. Research on long-context language models shows that giving AI more information is not always better; relevant information can become harder to use when buried in long inputs (Liu et al., 2023). In practice, this means a large and unfocused AI setup can make the tool less clear instead of more helpful.`

`There is also a learning concern. Kazemitabaar et al. (2023) studied novice learners using AI code generators across Python programming tasks and found that AI can improve task performance. At the same time, beginner-facing systems still need to support understanding, review, and modification rather than encouraging users to treat AI output as a black box. Buçinca et al. (2021) also found that people can overrely on AI recommendations, and that forcing users to pause and think can reduce this overreliance.`

`AI adoption also has process tradeoffs. The 2024 DORA report by Google Cloud notes that AI adoption can improve individual productivity, flow, and job satisfaction, but may negatively affect software delivery stability and throughput when development fundamentals are weak (Google Cloud, 2024). This supports the need for a tool that keeps scope, testing, and documentation visible while teams use AI.`

`ClearStack addresses these issues by giving users a structured first step before AI-assisted development. It helps hackathon teams, student developers, and beginner builders prepare clear project instructions, safety rules, documentation templates, and review checkpoints before relying on AI tools. It does not replace AI coding tools. Instead, it helps users set them up properly so the AI can stay focused, safer, and easier to work with.`

**`II. Whom is the solution for?`**

`ClearStack is primarily for hackathon teams, student developers, and beginner builders who want to use AI tools for software projects but do not yet have a clear project setup. These users often work under time pressure, especially in school projects, ideathons, capstones, and hackathons. They may know what they want to build, but they may not know how to tell an AI tool the right project information, boundaries, and rules.`

`The system is also useful for teams that already have a public GitHub repository but are unsure whether their setup is organized enough for AI-assisted work. ClearStack can perform a lightweight review of visible repository structure, such as the presence of a README, project guide, decision log, documentation files, and AI instruction files. This helps teams see what is missing or unnecessary without requiring deep code auditing.`

`Secondary users may include instructors, mentors, and team leaders who want students to use AI more responsibly. These users can benefit from ClearStack because it encourages planning, scope control, documentation, and review instead of allowing students to rely on AI output without understanding the project.`

`The main benefit for users is a clearer workflow. Instead of asking AI for help immediately, users first define what they are building, what stage they are in, what tools they use, what the AI should avoid, and what documentation should guide the project. This helps teams coordinate around the same instructions and reduces the risk of duplicated work, unclear scope, and forgotten decisions.`

**`III. Objectives`**

**`General Objective`**  
`To develop a web-based setup and safety assistant that helps hackathon teams, student developers, and beginner builders prepare clear AI project instructions before using AI tools for software development.`

**`Specific Objectives`**

1. `To guide users through structured questions about their project type, stage, experience level, tools, goals, and constraints.`  
2. `To generate copy-paste AI setup recommendations that describe what the AI needs to know, what it should avoid, and how outputs should be checked.`  
3. `To provide guardrails that encourage AI tools to ask clarifying questions, stay within scope, avoid unsafe actions, and support user understanding.`  
4. `To recommend lightweight documentation templates such as an AI Project Guide, Decision Log, and Progress Handoff.`  
5. `To review public GitHub repositories at a shallow level by checking visible structure and documentation signals.`  
6. `To provide a project-aware chatbot that answers follow-up questions about setup, documentation, scope, guardrails, and AI usage.`

**`IV. Software Solution Development Scope`**

`ClearStack will be developed as a web-based application. The system will focus on project setup, AI usage guardrails, lightweight documentation, and shallow public repository review. It will not function as a full autonomous coding agent.`

`The intended users are hackathon teams, student developers, beginner builders, and users starting an AI-assisted software project without a proper setup. The application may be used before development begins or during the early stages of a project when the team is still defining scope, tools, and documentation.`

	`The core modules of the system are:`

1. `Onboarding Questionnaire`  
2. `AI Setup Recommendation Generator`  
3. `Guardrail Checklist`  
4. `Public Repository Review`  
5. `Template Library`  
6. `Project-Aware Chatbot`  
7. `Results Dashboard`

`The expected inputs include user answers about project type, development stage, team setup, preferred AI tools, known technologies, learning needs, and boundaries. If available, the user may also provide a public GitHub repository URL. The system processes this information to generate setup recommendations, project guardrails, template suggestions, and follow-up guidance.`

`The expected outputs include copy-paste AI setup instructions, recommended documentation templates, repository setup feedback, and chatbot responses based on the user's project details. The recommended templates may include an AI Project Guide, Decision Log, and Progress Handoff.`

`The planned technology stack may include a web frontend built with React or a similar JavaScript framework, a backend service for saving setup sessions, a database such as Supabase or PostgreSQL, and an AI API for generating recommendations and chatbot responses. The public repository review may use the GitHub API or public repository contents to check visible files and folder structure.`

`For security and privacy, the MVP will only support public repository review. It will not request private repository access, edit files, create pull requests, run commands, or install packages. Users should be warned not to submit passwords, API keys, tokens, or private project secrets. The system should also explain that its recommendations are guidance and should still be reviewed by the user or team.`

`The MVP will not include deep code auditing, full security scanning, automatic file editing, private repository access, pull request creation, or complete app generation. These may be considered future expansions after the core setup and guardrail workflow is stable.`

**`V. Main Features`**

1. ### **`Guided Setup Questionnaire`**

`ClearStack begins by asking the user structured questions about the project. These questions cover what the user is building, what stage the project is in, what tools they plan to use, their experience level, and what they want AI to help with. The questionnaire also asks what the AI should avoid, such as adding unnecessary features, changing unrelated files, skipping tests, making assumptions, or exposing secrets.` 

`This feature is important because many AI mistakes begin with unclear instructions. By collecting project details first, ClearStack helps users define the work before relying on AI suggestions.`

2. ### **`AI Setup Recommendation Generator`**

`After the questionnaire, ClearStack generates copy-paste setup recommendations that users can place into their preferred AI tool. These recommendations describe the project goal, current stage, accepted tools, coding or documentation boundaries, verification steps, and expected behavior from the AI.` 

`The goal is not to create a long prompt pack. The goal is to give the AI only the project information it needs for the current stage. This helps prevent unrelated instructions from distracting the AI or pushing the project outside its intended scope.`

3. ### **`Guardrail Checklist`** 

`ClearStack provides a checklist of guardrails for AI-assisted development. These guardrails may include asking clarifying questions before acting, avoiding unrelated changes, explaining generated code, checking outputs, protecting secrets, and confirming before risky actions.`

`This feature supports safer AI use. Buçinca et al. (2021) found that pause points can reduce overreliance on AI recommendations. ClearStack applies this idea by building review and clarification steps into the setup.`

4. ### **`Lightweight Public Repository Review`** 

`For users with an existing public GitHub repository, ClearStack can review visible project structure. It may check whether the repository has a README, documentation folder, project guide, decision log, progress handoff file, testing scripts, or AI instruction files. It may also identify duplicated or overly broad setup files.`

`This review is intentionally shallow. It does not inspect private code, perform deep security auditing, or make automatic changes. Its purpose is to help teams see whether their project has the basic structure needed for clearer AI-assisted work.`

5. ### **`Template Library`**  

`ClearStack recommends lightweight templates that users can copy into their project. The three core templates are:`

* **`AI Project Guide`** `- explains what the project is, who it is for, what matters, what tools are used, and what AI should avoid.`  
* **`Decision Log`** `- records important project decisions and the reasons behind them.`  
* **`Progress Handoff`** `- summarizes what changed, what is stable, what remains unresolved, and what the next teammate or AI session should know.`

`These templates support continuity. Ahmeti et al. (2024) found that Architecture Decision Records helped address knowledge transfer and documentation culture in practice. ClearStack applies a simpler version of this idea for short-term student and hackathon projects.`

6. ### **`Project-Aware Chatbot`** 

`ClearStack includes a chatbot that answers questions based on the user's setup session. The chatbot can explain why a template is useful, whether a copied instruction is too broad, what files should be created first, or what the AI should avoid for the current project stage.`

`The chatbot is not intended to be a general coding assistant. It should focus on project setup, documentation, scope, safety, and AI usage decisions. This keeps the product distinct from ordinary AI coding tools and prevents the system from becoming too broad.`

7. ### **`Results Dashboard`**

`The results dashboard presents the user's setup in one organized page. It may show the recommended AI instructions, guardrail checklist, suggested templates, repository review results, and next steps. This gives the user a single place to review and copy the setup before continuing development.`

`This supports the theme because it gives users a clear starting point before using AI. Instead of wondering what to tell the AI or which setup files to create, users can see the essentials in one place.`

**`VI. Mockups`**  
`The primary objective of these mockups is to illustrate the onboarding sequence; decorative or supplementary screens are considered secondary to the configuration journey.`

`![][image1]`

`Landing Page`

### **`A. Landing Page: The Entry Point`**

`The Landing Page serves as the primary gateway to the application. It is designed to communicate the core value proposition—simplifying the complexity of AI-assisted project setup—and to funnel users into the setup workflow through clear, high-contrast Calls-to-Action (CTAs).`

**`Contribution to User Experience (UX):`**

* **`Reduced Cognitive Load:`** `By using a minimalist "center-stage" layout, the design prevents information overload, allowing users to focus entirely on the primary mission statement.`  
* **`Empathy-Driven Design:`** `The headline ("Build software with clarity, not confusion") acknowledges the frustrations of early-stage developers, immediately building trust and alignment with user needs.`

**`Contribution to Usability:`**

* **`Visual Hierarchy:`** `Large, bold typography and distinct button colors guide the user’s eye toward the most important action: "Start your setup."`  
* **`Frictionless Navigation:`** `The navigation bar is streamlined to only include essential links (How it works, Features, For educators), ensuring that users do not get lost before reaching the core functionality.`

`![][image2]`

`How it Works Section`

### **`B. "How It Works" Section`**

`The "How It Works" section serves as a procedural roadmap. Its primary objective is to demystify the application’s underlying logic by breaking down a complex technical setup into three digestible stages: input (questions), output (custom package), and execution (building). It transforms the abstract concept of "AI project scaffolding" into a concrete, time-bound promise ("in minutes").`

**`Contribution to User Experience (UX):`**

* **`Mental Model Alignment -`** `By using a numbered, step-by-step layout, the design helps users build an accurate mental model of how the system functions. This transparency reduces the "black box" anxiety often associated with AI tools.`  
* **`Expectation Management -`** `Specifying that the first step "takes about 3 minutes" sets clear expectations. This transparency respects the user’s time and lowers the barrier to entry by promising a quick return on investment.`  
* **`Reassurance -`** `The mention of "plain language" in Step 02 specifically caters to the user's need for clarity, reinforcing the brand's core promise of removing confusion.`

**`Contribution to Usability:`**

* **`Scannability -`** `The use of large, faded numerals (01, 02, 03) and bold subheaders allows users to grasp the entire workflow in seconds. This supports "skim-reading," which is the primary way users interact with landing pages.`  
* **`Logical Flow -`** `The horizontal layout naturally follows the left-to-right reading pattern, reinforcing the chronological sequence of the interaction process.`  
* **`Visual Consistency -`** `The layout maintains the same minimalist aesthetic and typography as the Hero section, providing a cohesive interface that prevents "visual jarring" as the user scrolls through the application.`

`![][image3]`

`Features Section`

### **`C. Features Section`**

`The Features section serves as a functional deep dive. Its primary objective is to detail the specific tools and methodologies ClearStack uses to solve the problem of AI overdependence. By highlighting "Structured Onboarding," "Smart Setup Generation," and "Project-Aware Chat," this mockup demonstrates how the application translates its philosophical goals into tangible software features.`

**`Contribution to User Experience (UX):`**

* **`Philosophical Alignment -`** `The bold headline, "Built to reduce overdependence on AI, not increase it," establishes a unique value proposition. This resonates with educators and serious students who are wary of "black-box" code generators, creating a sense of professional purpose.`  
* **`Feature Categorization -`** `By grouping functionalities into distinct "cards," the design helps users categorize the system’s benefits. This layout answers the "What’s in it for me?" question by showing that the tool provides both a roadmap (setup) and ongoing support (chat).`  
* **`Intentionality -`** `The description of the chat as "a guide, not a code machine" reinforces a supportive UX that prioritizes learning and critical thinking over mindless automation.`

**`Contribution to Usability -`**

* **`Iconographic Cues -`** `Each feature is paired with a simple, recognizable icon (grid, clock, message bubble). These visual anchors improve recognition over recall, allowing users to quickly identify which part of the system handles which task.`  
* **`Card-Based Layout -`** `Using white cards against a soft beige background creates high contrast and "breathing room." This makes the text highly readable and ensures that each feature is perceived as a modular, easy-to-understand unit.`  
* **`Concise Copywriting -`** `The use of short, punchy paragraphs ensures that users can absorb complex technical concepts (like "AI workflow rules" or "project-aware context") without facing a wall of text, facilitating a smoother information-gathering process.`

`![][image4]`

`Educators Section`

### **`D. Educators Section`**

`The "Educators" section acts as a bridge between academic goals and technical implementation. Its primary purpose is to demonstrate the application’s pedagogical value by showing how it converts AI interactions into learning opportunities. It visualizes the actual "outputs" (the Generated Setup Package) to prove that the system prioritizes documentation and structured reasoning over raw code output.`

**`Contribution to User Experience (UX):`**

* **`Validation of Educational Outcomes`** `- By listing specific outcomes like "habit of structured thinking" and "accountability and reflection," the UX appeals to the secondary user persona (instructors and mentors). It shifts the focus from "finishing a project" to "mastering a process."`  
* **`Tangible Social Proof`** `- The visual preview of the "Generated Setup Package" (displaying files like PROJECT_CONTEXT.md and DECISIONS.md) provides immediate evidence of the product's utility. Seeing the specific file names helps the user visualize the final result of their interaction, reducing ambiguity.`  
* `Positive Reinforcement - The use of green checkmarks for key benefits creates a sense of accomplishment and safety, signaling that the system is designed with rigorous standards in mind.`

**`Contribution to Usability:`**

* **`Visual Anchoring`** `- The mockup uses a split-screen layout—text on the left, visual evidence on the right. This allows the user to read a claim and immediately see the supporting visual evidence without scrolling, improving information retention.`  
* **`Affordance and Familiarity`** `- The "Generated Setup Package" list uses a file-explorer aesthetic that is familiar to developers and students. This high mapping between the interface and real-world development environments makes the system feel integrated rather than isolated.`  
* **`Content Scannability`** `- The bulleted list format allows educators to quickly identify key "guardrails," making it easier to evaluate if the tool meets their specific curriculum requirements.`

`![][image5]`

`![][image6]`

`![][image7]`

`![][image8]`

`![][image9]`

`![][image10]`

`![][image11]![][image12]`

`![][image13]![][image14]![][image15]`

`![][image16]`

`Setting Up` 

### **`E. Guided AI Setup Workflow (Onboarding Process)`**

`The Setting Up mockups represent the core interactive engine of ClearStack. The purpose of this multi-step onboarding sequence is to gather granular project telemetry—such as project type, development stage, experience level, and tech stack—to generate a hyper-personalized configuration package. It transitions the user from a state of "blank-page syndrome" to a structured, ready-to-build environment through a series of intentional, low-friction questions.`

**`Contribution to User Experience (UX):`**

* **`Progressive Disclosure -`** `By breaking 11 steps into individual screens, the system prevents "form fatigue." Each step focuses on a single decision, making the complex task of project architectural planning feel like a simple conversation.`  
* **`Personalization & Calibration -`** `Questions regarding "Experience Level" and "Learning Support" allow the UX to adapt to the user's specific needs. A beginner receives more explanatory guardrails, while an experienced developer receives more streamlined, efficiency-focused rules.`  
* **`Aesthetic Continuity -`** `The consistent use of dark-themed, high-contrast UI elements (buttons and chips) creates a professional and focused atmosphere, aligning with the "Technical Product Owner" persona the system aims to support.`

**`Contribution to Usability:`**

* **`State Management & Navigation -`** `The top progress bar and "Step X of 11" indicator provide vital system status visibility. Users always know how far they are in the process, which reduces drop-off rates and manages expectations.`  
* **`Interactive Affordances -`** `The use of "tags" and "chips" for multi-select options (e.g., Tech Stack, AI Tools) makes the interface touch-friendly and scannable. These elements provide clear visual feedback when selected, ensuring the user is certain of their inputs before clicking "Continue."`  
* **`Error Prevention and "Smart" Defaults -`** `The "Not sure yet" options and "Back" navigation provide a safety net, allowing users to move through the flow without the fear of making a permanent mistake. The final "Generating your setup package" screen uses a checklist animation to provide feedback on background operations, assuring the user that their custom package is being built accurately based on their inputs.`

`![][image17]`

`Project Packages and Chatbot`

### **`F. Project Dashboard (Setup Package and Project-Aware Assistant)`**

`The Project Dashboard is the operational heart of ClearStack. Its primary purpose is to deliver the generated assets and provide ongoing support through a split-screen interface. The left panel serves as a Resource Repository for the custom markdown files, while the right panel acts as a Contextual Support Center via the AI assistant. This dual-view ensures the user has both the tools and the guidance needed to begin development immediately.`

**`Contribution to User Experience (UX):`**

* **`Contextual Integration -`** `The AI assistant is "project-aware," meaning it references the specific files shown on the left (e.g., DECISIONS.md). This creates a cohesive UX where the documentation and the assistant work as a unified team, rather than fragmented tools.`  
* **`Educational Scaffolding -`** `Features like the "Why this file matters" callout box provide immediate educational value. It explains the purpose behind documentation habits, reinforcing the product's goal of building better developer habits.`  
* **`Safe Exploration -`** `By explicitly stating that the assistant is "not a code generator," the UX sets boundaries that encourage the user to think critically and solve problems, fostering growth rather than dependency.`

**`Contribution to Usability:`**

* **`Direct Manipulation and Accessibility -`** `The tabbed interface for "Your Setup Package" allows for quick switching between files. Clear action buttons like "Download all" and "Copy file" provide high utility, allowing users to easily move these assets into their local development environment (e.g., VS Code).`  
* **`Feedback Loops -`** `The chat interface uses standard messaging design patterns, making it instantly familiar. The assistant’s proactive suggestions (e.g., "I'd recommend checking your PROJECT_CONTEXT.md") act as system-initiated guidance, helping users who may not know what to ask first.`  
* **`Information Density Management -`** `By using an accordion-style view for file content and a clear separation between "Explanation" and "File content" tabs, the interface remains clean and scannable despite the high volume of technical information being presented.`

**`VII. References`**

`Ahmeti, B., Linder, M., Groner, R., & Wohlrab, R. (2024). Introducing Architecture Decision Records in Practice: An Action Research Study (ECSA 2024 - Research Papers) ECSA 2024. European Conference on Software Architecture. https://conf.researchr.org/details/ecsa-2024/ecsa-2024-research-papers/9/Introducing Architecture-Decision-Records-in-Practice-An-Action-Research-Study` 

`Buçinca, Z., Malaya, M. B., & Gajos, K. Z. (2021). To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-assisted Decision-making. Proceedings of the ACM on Human-Computer Interaction, 5(CSCW1), 1–21. https://doi.org/10.1145/3449287` 

`Google Cloud. (2024). DORA | Accelerate State of DevOps Report 2024. DORA. https://dora.dev/research/2024/dora-report/` 

`Kazemitabaar, M., Chow, J., Carl, M., Ericson, B. J., Weintrop, D., & Grossman, T. (2023). Studying the effect of AI Code Generators on Supporting Novice Learners in Introductory Programming. Studying the Effect of AI Code Generators on Supporting Novice Learners in Introductory Programming. https://doi.org/10.1145/3544548.3580919` 

`Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P. (2023). Lost in the Middle: How Language Models Use Long Contexts. ARXIV. https://doi.org/10.48550/arxiv.2307.03172` 

`Stack Overflow. (2025). AI | 2025 Stack Overflow Developer Survey. https://survey.stackoverflow.co/2025/a` 