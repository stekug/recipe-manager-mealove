import styled, { css } from 'styled-components';
import tags from '@/lib/tags.json';
import units from '@/lib/units.json';
import { useState } from 'react';

export default function RecipeForm() {
  const [inputRow, setInputRow] = useState([{ id: crypto.randomUUID() }]);

  const handleInputRow = () => {
    const array = [...inputRow, { id: crypto.randomUUID() }];
    setInputRow(array);
    console.log(array);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    console.log(data);
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        {/* Title */}
        <StyledInputElement>
          <StyledLabel htmlFor='title'>Recipe Name</StyledLabel>
          <StyledInput
            type='text'
            id='title'
            name='title'
            required
            $leftAlign
          />
        </StyledInputElement>

        {/* Portions */}
        <StyledInputElement>
          <StyledLabel htmlFor='servings'>Servings</StyledLabel>
          <StyledElementGroup>
            <StyledFormText>This recipe is for</StyledFormText>
            <StyledInput
              type='number'
              id='servings'
              name='servings'
              $isMedium
            />
            <StyledFormText>person(s).</StyledFormText>
          </StyledElementGroup>
        </StyledInputElement>

        {/* Ingredients and quantities */}
        <StyledInputElement>
          <StyledH2>Ingredients and quantities</StyledH2>
          <StyledCellWrapper>
            <StyledH3>Quantity</StyledH3>
            <StyledH3>Unit</StyledH3>
            <StyledH3>Ingredient</StyledH3>
          </StyledCellWrapper>
          {inputRow.map((row) => {
            return (
              <StyledCellWrapper key={row.id}>
                <StyledTableCell type='number' name='quantity' $isMedium />
                <StyledDropdown id='unit' name='unit'>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.unit}>
                      {unit.unit}
                    </option>
                  ))}
                </StyledDropdown>
                <StyledTableCell name='name' $isLarge $leftAlign />
              </StyledCellWrapper>
            );
          })}
          <button type='button' onClick={handleInputRow}>
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
          />
        </StyledInputElement>

        {/* Working hours */}
        <StyledInputElement>
          <StyledLabel htmlFor='prepTimeHours'>Working hours</StyledLabel>
          <StyledElementGroup>
            <StyledInput
              type='number'
              id='prepTimeHours'
              name='prepTimeHours'
              $isMedium
            />
            <StyledH3>h</StyledH3>
            <StyledLabel htmlFor='prepTimeMins'></StyledLabel>
            <StyledInput
              type='number'
              id='prepTimeMins'
              name='prepTimeMins'
              $isMedium
            />
            <StyledH3>min</StyledH3>
          </StyledElementGroup>
        </StyledInputElement>

        {/* Cooking time */}
        <StyledInputElement>
          <StyledLabel htmlFor='cookingTimeHours'>Cooking time</StyledLabel>
          <StyledElementGroup>
            <StyledInput
              type='number'
              id='cookingTimeHours'
              name='cookingTimeHours'
              $isMedium
            />
            <StyledH3>h</StyledH3>
            <StyledLabel htmlFor='cookingTimeMins'></StyledLabel>
            <StyledInput
              type='number'
              id='cookingTimeMins'
              name='cookingTimeMins'
              $isMedium
            />
            <StyledH3>min</StyledH3>
          </StyledElementGroup>
        </StyledInputElement>

        {/* Difficulty */}
        <StyledInputElement>
          <StyledLabel htmlFor='difficulty'>Difficulty</StyledLabel>
          <StyledDropdown id='difficulty' name='difficulty'>
            <option value='easy'>easy</option>
            <option value='medium'>medium</option>
            <option value='hard'>hard</option>
            <option value='godlike'>godlike</option>
          </StyledDropdown>
        </StyledInputElement>

        {/* Main Category */}
        <StyledInputElement>
          <StyledLabel htmlFor='categories'>Main Categories</StyledLabel>
          <StyledCategoryContainer>
            {tags.map((tag) => {
              return (
                <StyledCategoryElement key={tag.id}>
                  <label htmlFor={tag.name}>{tag.name}</label>
                  <input
                    type='radio'
                    name='categories'
                    id={tag.name}
                    value={tag.name}
                  />
                </StyledCategoryElement>
              );
            })}
          </StyledCategoryContainer>
        </StyledInputElement>
        <StyledSubmitButton aria-label='submit new recipe'>
          Submit
        </StyledSubmitButton>
      </StyledForm>
    </>
  );
}

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-5);
  padding: var(--spacing-5);
`;

const StyledInputElement = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledElementGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--spacing-2);
`;

const StyledH2 = styled.h2`
  font: var(--font-headline-2);
  padding-bottom: var(--spacing-2);
`;

const StyledH3 = styled.h3`
  font: var(--font-headline-3);
`;

const StyledFormText = styled.p`
  font: var(--font-input);
`;

const StyledLabel = styled.label`
  font: var(--font-headline-2);
  padding-bottom: var(--spacing-2);
`;

const StyledInput = styled.input`
  height: 2rem;
  border: 1px solid var(--color-neutral-4-alpha25);
  border-radius: var(--radius-s);
  text-align: center;
  font: var(--font-input);
  ${({ $isMedium }) =>
    $isMedium &&
    css`
      width: 60px;
    `}
  ${({ $leftAlign }) =>
    $leftAlign &&
    css`
      text-align: left;
    `}
`;

const StyledTextArea = styled.textarea`
  border: 1px solid var(--color-neutral-4-alpha25);
  border-radius: var(--radius-s);
`;

const StyledCellWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 2fr 4fr;
`;

const StyledTableCell = styled.input`
  font: var(--font-input);
  height: 2rem;
  border: 1px solid var(--color-neutral-4-alpha25);
  border-radius: var(--radius-s);
  margin-top: var(--spacing-1);
  text-align: center;
  ${({ $isMedium }) =>
    $isMedium &&
    css`
      width: 60px;
    `}
  ${({ $isLarge }) =>
    $isLarge &&
    css`
      width: 100%;
    `}
      ${({ $leftAlign }) =>
    $leftAlign &&
    css`
      text-align: left;
    `}
`;

const StyledDropdown = styled.select`
  font: var(--font-input);
  height: 2rem;
  border: 1px solid var(--color-neutral-4-alpha25);
  border-radius: var(--radius-s);
  margin-top: var(--spacing-1);
  width: 70px;
`;

const StyledCategoryContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--spacing-1);
`;

const StyledCategoryElement = styled.div`
  display: flex;
  flex-direction: column-reverse;
  text-align: center;
  font: var(--font-headline-3);
  background-color: var(--color-neutral-2);
  border-radius: var(--radius-m);
  height: 60px;
  width: 60px;
`;

const StyledSubmitButton = styled.button`
  display: block;
`;
