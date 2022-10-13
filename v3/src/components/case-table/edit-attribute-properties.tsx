import { FormControl, FormLabel, HStack, Input, Radio, RadioGroup, Select, Textarea } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { AttributeType, attributeTypes } from "../../data-model/attribute"
import { useDataSetContext } from "../../hooks/use-data-set-context"
import { CodapModal } from "../codap-modal"

interface IEditAttributePropertiesModalContentProps {
  attributeName: string
  description: string
  unit: string
  precision: string
  attrType: AttributeType
  editable: string
  setAttributeName: (name: string) => void
  setDescription: (description: string) => void
  setUnit: (unit: string) => void
  setAttrType: (type: AttributeType) => void
  setEditable: (editable: string) => void
  setPrecision: (precision: string) => void
}

export const EditAttributePropertiesModalContent = ({attributeName, description, unit, precision, attrType,
    editable, setAttributeName, setDescription, setUnit, setAttrType, setEditable, setPrecision,
  }: IEditAttributePropertiesModalContentProps) => {

  return (
    <FormControl display="flex" flexDirection="column" w={350}>
      <FormLabel display="flex" flexDirection="row">name:
        <Input size="xs" ml={5} placeholder="attribute" value={attributeName} onFocus={(e) => e.target.select()}
              onChange={event => setAttributeName(event.target.value)} data-testid="attr-name-input"
              onKeyDown={(e) => e.stopPropagation()}
        />
      </FormLabel>
      <FormLabel>description:
        <Textarea size="xs" placeholder="Describe the attribute" value={description} onFocus={(e) => e.target.select()}
          onChange={event => setDescription(event.target.value)} data-testid="attr-description-input"
          onKeyDown={(e) => e.stopPropagation()}
        />
      </FormLabel>
      <FormLabel display="flex" flexDirection="row" mr={5}>type
        <Select size="xs" ml={5} value={attrType} onChange={(e) => setAttrType(e.target.value as AttributeType)}>
          <option value={"none"}>none</option>
          {attributeTypes.map(aType => {
            return (<option key={aType} value={aType} data-testid="attr-type-option">{aType}</option>)})
          }
        </Select>
      </FormLabel>
      <FormLabel display="flex" flexDirection="row">unit:
        <Input size="xs" placeholder="unit" ml={5} value={unit} onFocus={(e) => e.target.select()}
          onChange={event => setUnit(event.target.value)} data-testid="attr-unit-input"
          onKeyDown={(e) => e.stopPropagation()}
        />
      </FormLabel>
      <FormLabel display="flex" flexDirection="row" mr={5}>precision:
        <Select size="xs" ml={5} value={precision} onChange={(e) => setPrecision(e.target.value)}>
          <option value={""}></option>
          <option value={"0"} data-testid="attr-precision-option">0</option>
          <option value={"1"} data-testid="attr-precision-option">1</option>
          <option value={"2"} data-testid="attr-precision-option">2</option>
          <option value={"3"} data-testid="attr-precision-option">3</option>
          <option value={"4"} data-testid="attr-precision-option">4</option>
          <option value={"5"} data-testid="attr-precision-option">5</option>
          <option value={"6"} data-testid="attr-precision-option">6</option>
          <option value={"7"} data-testid="attr-precision-option">7</option>
          <option value={"8"} data-testid="attr-precision-option">8</option>
        </Select>
      </FormLabel>
      <FormLabel display="flex" flexDirection="row">editable
        <RadioGroup value={editable} ml={5} onChange={(value) => setEditable(value)} data-testid="attr-editable-radio"
          onKeyDown={(e) =>e.stopPropagation()}>
          <HStack>
            <Radio value="true">True</Radio>
            <Radio value="false">False</Radio>
          </HStack>
        </RadioGroup>
      </FormLabel>
    </FormControl>
  )
}

interface IProps {
  columnName: string
  isOpen: boolean
  onClose: () => void
  onModalOpen: (open: boolean) => void
}

export const EditAttributePropertiesModal = ({columnName, isOpen, onClose, onModalOpen}: IProps,
    ref: any) => {
  const data = useDataSetContext()
  const attribute = data?.attrFromName(columnName)
  const [attributeName, setAttributeName] = useState(columnName || "attribute")
  const [description, setDescription] = useState("")
  const [unit, setUnit] = useState("")
  const [precision, setPrecision] = useState("")
  const [attrType, setAttrType] = useState<AttributeType | "none">("none")
  const [editable, setEditable] = useState("true")

  useEffect(() => {
    setAttributeName(columnName)
  },[columnName])

  const editProperties = () => {
    onClose()
    onModalOpen(false)
    if (attribute) {
      attribute.setName(attributeName)
      attribute.setUserDescription(description)
      attribute.setUserType(attrType === "none" ? undefined : attrType)
      attribute.setUnits(unit)
      attribute.setUserPrecision(isFinite(+precision) ? +precision : undefined)
      attribute.setUserEditable(editable === "true")
    }
  }
  const closeModal = () => {
    onClose()
    onModalOpen(false)
    setAttributeName(attribute?.name || "")
    setDescription(attribute?.userDescription || "")
    setAttrType(attribute?.userType ? attribute?.userType : "none")
    setUnit(attribute?.units || "")
    setPrecision((attribute?.userPrecision)?.toString() || "")
    setEditable((attribute?.userEditable)?.toString() || "true")
  }

  return (
    <CodapModal
      isOpen={isOpen}
      onClose={closeModal}
      title="Attribute Properties"
      hasCloseButton={true}
      Content={EditAttributePropertiesModalContent}
      contentProps={{attributeName, description, unit, precision, attrType, editable,
        setAttributeName, setDescription, setUnit, setAttrType, setEditable, setPrecision}}
      buttons={[{ label: "Cancel", onClick: closeModal },{ label: "Apply", onClick: editProperties}]}
    />
  )
}
