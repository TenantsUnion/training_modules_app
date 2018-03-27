declare namespace VueForm {
    interface FormState {
        $dirty: boolean;
        $error?: { [index: string]: FormField };
        $invalid: boolean;
        $pending: boolean;
        $pristine: boolean;
        $submitted: boolean;
        $submittedState: { [index: string]: any }
        _submit: () => void;
        _reset: () => void;
    }

    interface FormField {
        $dirty: boolean;
        $error?: {
            [index: string]: boolean;
        };
        $invalid: boolean;
        $pending: boolean;
        $pristine: boolean;
        $submitted: boolean;
        $touched: boolean;
        $untouched: boolean;
        $valid: boolean;
        _setValidatorVadility: (validator: { [index: string]: string }, isValid?: boolean) => void;
    }
}

export = VueForm;

