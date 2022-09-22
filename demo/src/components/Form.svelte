<script lang="ts">
    import { form } from "../utils/form.js";
    export let errors: Awaited<ReturnType<typeof form["validate"]>> = null;
    export let success = false;

    let useServerSideValidation = false;

    const handleSubmit = async (e: SubmitEvent) => {
        success = false;
        const formElement = e.target as HTMLFormElement;
        if (useServerSideValidation) {
            formElement.submit()
        } else {
            const formData = new FormData(formElement);
            errors = await form.validate(formData);
            if (errors) return;
            success = true;
        }
    };
</script>

<form on:submit|preventDefault={handleSubmit} method="post" class="w-full py-2">
    <div>
        <label for="email" class="text-sm">Email</label><br />
        <input
            type="text"
            name="email"
            id="email"
            class="border rounded px-4 py-1.5 w-full"
        />
        <p class="text-sm text-red-400">{errors?.email || ""}</p>
    </div>
    <div class="mt-2">
        <label for="password" class="text-sm">Password</label><br />
        <input
            type="password"
            name="password"
            id="password"
            class="border rounded px-4 py-1.5 w-full"
        />
        <p class="text-sm text-red-400">{errors?.password || ""}</p>
    </div>
    <div class="mt-2">
        <label for="password-confirm" class="text-sm">Confirm password</label
        ><br />
        <input
            type="password"
            name="password-confirm"
            id="password-confirm"
            class="border rounded px-4 py-1.5 w-full"
        />
        <p class="text-sm text-red-400">{errors?.["password-confirm"] || ""}</p>
    </div>
    <input
        type="submit"
        value="Continue"
        class="py-1.5 px-4 rounded w-full bg-black text-white mt-4"
    />
</form>
<div>
    <input type="checkbox" id="ssv" bind:checked={useServerSideValidation} />
    <label for="ssv" class="text-sm">Use server-side validation</label>
</div>
{#if success}
    <p class="text-indigo-400 font-medium">Success!</p>
{/if}
