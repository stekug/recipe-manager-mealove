import { ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react';
import { Recipe } from '@/types';
import IngredientInput from '@/components/RecipeForm/IngredientInput';
import TimeInput from '@/components/RecipeForm/TimeInput';
import categories from '@/lib/categories.json';
import {
  RecipeFormProps,
  HandleChangeParams,
  Ingredient,
  ImageData,
} from '@/types/RecipeForm.types';
import { useRouter } from 'next/router';
import {
  StyledForm,
  StyledInputElement,
  StyledLabel,
  StyledInput,
  StyledElementGroup,
  StyledFormText,
  StyledH2,
  StyledH3,
  StyledCellWrapper,
  StyledTextArea,
  StyledDropdown,
  StyledCategoryContainer,
  StyledCategoryElement,
  StyledImageUpladContainer,
  StyledCloudIcon,
  StyledUploadText,
  StyledUploadSpan,
  StyledImageDropArea,
  StyledImagePreview,
  StyledImageDeleteButtonWrapper,
} from '@/components/RecipeForm/recipeStyles';
import useLocalStorageState from 'use-local-storage-state';
import FormButtons from '@/components/RecipeForm/FormButtons';
import Button from '@/components/Button';

const emptyRecipe: Recipe = {
  category: '',
  cookingTime: 0,
  description: '',
  difficulty: 'easy',
  imageUrl: '/recipe-default-imgs/alexander-mils-pPhN8HFzkDE-unsplash.jpg',
  ingredients: [
    {
      id: '1',
      quantity: '',
      unit: '',
      name: '',
    },
  ],
  instructions: [
    {
      id: '1',
      description: '',
    },
  ],
  prepTime: 0,
  servings: 1,
  tags: [],
  title: '',
};

export default function RecipeForm({
  onAddRecipe,
  onEditRecipe,
  isEditMode,
  recipe,
}: RecipeFormProps) {
  const [recipeData, setRecipeData] = useLocalStorageState('recipeData', {
    defaultValue: emptyRecipe,
  });

  const [image, setImage] = useState<ImageData | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && recipe) {
      setRecipeData(recipe);
    } else {
      setRecipeData(emptyRecipe);
    }
  }, [recipe, setRecipeData, isEditMode]);

  const router = useRouter();

  /****************************************
   * SUBSECTION: Event Handlers
   ****************************************/

  /**
   * Direct key/value changes of the recipeData object.
   * Handles changes to text and select inputs (name & main category)
   */
  const handleChange = (event: HandleChangeParams) => {
    const { name, value } = event.target;

    setRecipeData((currData) => ({
      ...currData,
      [name]: value,
    }));
  };

  /**
   * Handles changes to the servings input field
   */
  const handleServingsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (value === '') {
      setRecipeData((currData) => ({
        ...currData,
        [name]: 1,
      }));
    } else {
      setRecipeData((currData) => ({
        ...currData,
        [name]: parseInt(value),
      }));
    }
  };

  /**
   * Handles changes to individual ingredient fields
   */
  const handleIngredientChange = (newIngredient: Ingredient) => {
    setRecipeData((currData) => {
      const newIngredients = currData.ingredients.map((ingredient) =>
        ingredient.id === newIngredient.id ? newIngredient : ingredient
      );
      return { ...currData, ingredients: newIngredients };
    });
  };

  /**
   * Adds a new empty ingredient to the ingredients array
   */
  const handleAddIngredient = () => {
    setRecipeData((currData) => {
      const newIngredients = [
        ...currData.ingredients,
        {
          id: crypto.randomUUID(),
          quantity: '',
          unit: '',
          name: '',
        },
      ];
      return { ...currData, ingredients: newIngredients };
    });
  };

  /**
   * Handles changes to the recipe instructions textarea
   */
  const handleInstructionsChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;

    setRecipeData((currData) => {
      const newInstructions = [...currData.instructions];
      newInstructions[0] = { ...newInstructions[0], description: value };
      return {
        ...currData,
        instructions: newInstructions,
      };
    });
  };

  /**
   * Handles changes to the preparation time inputs
   */
  const handlePrepTimeChange = (newPrepTime: number) => {
    setRecipeData((currData) => ({
      ...currData,
      prepTime: newPrepTime,
    }));
  };

  /**
   * Handles changes to the cooking time inputs
   */
  const handleCookingTimeChange = (newCookingTime: number) => {
    setRecipeData((currData) => ({
      ...currData,
      cookingTime: newCookingTime,
    }));
  };

  /**
   * Submits the form, creates a new recipe, and resets the form
   */
  async function handleCreationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    /**
     * Create Form Data for Image
     */
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    /**
     * Get HTTPS Image Url from Cloudinary
     */
    const { secure_url } = await response.json();

    const newRecipe = {
      ...recipeData,
      imageUrl: secure_url,
    };
    onAddRecipe?.(newRecipe);

    setRecipeData(emptyRecipe);
  }

  /**
   * Submits the form, edits the stored recipe and resets the form
   */
  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onEditRecipe?.(recipeData);

    event.currentTarget.reset();
  };

  /**
   * Cancels the editing process and routes back to DetailsPage
   */
  const handleCancel = () => {
    router.push(`/recipes/${recipeData._id}`);
  };

  /**
   * Handle Image Upload Display
   */
  const handleImageUploadChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        setImage({ name: file.name, src: dataURL });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOnClickImageDelete = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  /**
   * Handle Image Drop and pass image to input field
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        const changeEvent = new Event('change', { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <>
      <StyledForm
        onSubmit={isEditMode ? handleEditSubmit : handleCreationSubmit}
      >
        {/* Title */}
        <StyledInputElement>
          <StyledLabel htmlFor='title'>Recipe Name</StyledLabel>
          <StyledInput
            type='text'
            id='title'
            name='title'
            value={recipeData.title}
            onChange={handleChange}
            maxLength={40}
            required
            $leftAlign
            placeholder='Type your Recipe Name here'
          />
        </StyledInputElement>

        {/* Servings */}
        <StyledInputElement>
          <StyledLabel htmlFor='servings'>Servings</StyledLabel>
          <StyledElementGroup>
            <StyledFormText>This recipe is for</StyledFormText>
            <StyledInput
              type='number'
              id='servings'
              name='servings'
              $isMedium
              value={recipeData.servings}
              onChange={handleServingsChange}
              min={1}
              max={99}
            />
            <StyledFormText>person(s).</StyledFormText>
          </StyledElementGroup>
        </StyledInputElement>

        {/* Ingredients And Quantities */}
        <StyledInputElement>
          <StyledH2>Ingredients and quantities</StyledH2>
          <StyledCellWrapper>
            <StyledH3>Quantity</StyledH3>
            <StyledH3>Unit</StyledH3>
            <StyledH3>Ingredient</StyledH3>
          </StyledCellWrapper>
          {recipeData.ingredients.map((ingredient) => {
            return (
              <IngredientInput
                key={ingredient.id}
                ingredient={ingredient}
                onIngredientChange={handleIngredientChange}
              />
            );
          })}
          <button type='button' onClick={handleAddIngredient}>
            +
          </button>
        </StyledInputElement>

        {/* Recipe preparation */}
        <StyledInputElement>
          <StyledLabel htmlFor='instructions'>Recipe preparation</StyledLabel>
          <StyledTextArea
            id='instructions'
            name='instructions'
            rows={4}
            cols={10}
            minLength={1}
            required
            value={recipeData.instructions[0].description}
            onChange={handleInstructionsChange}
          />
        </StyledInputElement>

        {/* Prep Time */}
        <TimeInput
          time={recipeData.prepTime}
          onTimeChange={handlePrepTimeChange}
          what='prep'
        />

        {/* Cooking Time */}
        <TimeInput
          time={recipeData.cookingTime}
          onTimeChange={handleCookingTimeChange}
          what='cooking'
        />

        {/* Difficulty */}
        <StyledInputElement>
          <StyledLabel htmlFor='difficulty'>Difficulty</StyledLabel>
          <StyledDropdown
            id='difficulty'
            name='difficulty'
            onChange={handleChange}
            value={recipeData.difficulty}
          >
            <option value='easy'>easy</option>
            <option value='medium'>medium</option>
            <option value='hard'>hard</option>
            <option value='godlike'>godlike</option>
          </StyledDropdown>
        </StyledInputElement>

        {/* Main Category */}
        <StyledInputElement>
          <StyledLabel htmlFor='category'>Main Categories</StyledLabel>
          <StyledCategoryContainer>
            {categories.map((category) => {
              return (
                <StyledCategoryElement key={category.id}>
                  <label htmlFor={category.name}>{category.name}</label>
                  <input
                    type='radio'
                    name='category'
                    id={category.name}
                    value={category.name}
                    checked={category.name === recipeData.category}
                    required
                    onChange={handleChange}
                  />
                </StyledCategoryElement>
              );
            })}
          </StyledCategoryContainer>
        </StyledInputElement>

        {/* Image Upload */}
        <StyledInputElement>
          {image ? (
            <StyledH2>Swap Image by clicking it</StyledH2>
          ) : (
            <StyledH2>Image Upload</StyledH2>
          )}
          <StyledImageDropArea htmlFor='imageUpload'>
            <StyledImageUpladContainer
              id='imageView'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type='file'
                id='imageUpload'
                name='imageUpload'
                accept='image/*'
                hidden
                ref={fileInputRef}
                onChange={handleImageUploadChange}
              />

              {image ? (
                <StyledImagePreview
                  src={image?.src}
                  alt='image'
                  width='350'
                  height='0'
                />
              ) : (
                <>
                  <StyledCloudIcon />
                  <StyledUploadText>Choose image to Upload</StyledUploadText>
                  <StyledUploadSpan>
                    Or drag and drop the image here
                  </StyledUploadSpan>
                </>
              )}
            </StyledImageUpladContainer>
          </StyledImageDropArea>
          <StyledImageDeleteButtonWrapper>
            {image && (
              <Button
                type='button'
                variant='$delete'
                onClickBehavior={handleOnClickImageDelete}
              >
                Image
              </Button>
            )}
          </StyledImageDeleteButtonWrapper>
        </StyledInputElement>
        {/* Action Buttons */}
        <FormButtons isEditMode={isEditMode} onCancel={handleCancel} />
      </StyledForm>
    </>
  );
}
