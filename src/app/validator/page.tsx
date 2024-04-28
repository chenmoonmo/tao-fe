import { Button, Heading, Table, TextFieldInput } from "@radix-ui/themes";

function Page() {
  return (
    <main className="flex flex-col items-center justify-between pt-20">
      <Heading>Validator</Heading>
      <div className="grid grid-cols-[max-content,max-content,max-content] gap-y-3 gap-x-1 w-[450px] mt-4">
        <Heading size="3" weight="medium">
          NetID
        </Heading>
        <div className="col-span-2">1</div>

        {/* <div className="flex items-center gap-10">
        
        </div> */}
        <Heading size="3" weight="medium" className="">
          Stake
        </Heading>
        <TextFieldInput className="!w-24" />
        <div className="flex justify-end">
          <Button>Confirm</Button>
        </div>

        <Heading size="3" weight="medium">
          Register as a validator
        </Heading>
        <div className="col-span-2 flex justify-end">
          <Button>Confirm</Button>
        </div>

        <Heading size="3" weight="medium">
          Register as a legal verifier
        </Heading>
        <div className="col-span-2 flex justify-end">
          <Button>Confirm</Button>
        </div>

        <Heading size="3" weight="medium">
          Set weights
        </Heading>
        <div className="flex justify-end col-span-2">state</div>

        <div className="col-span-2">mineraddress1</div>
        <TextFieldInput className="!w-24" />

        <div className="col-span-2">mineraddress1</div>
        <TextFieldInput className="!w-24" />

        <div className="col-span-2">mineraddress1</div>
        <TextFieldInput className="!w-24" />

        <div className="col-span-2">mineraddress1</div>
        <TextFieldInput className="!w-24" />

        <div className="col-span-3 flex justify-end">
          <Button>Submit</Button>
        </div>
      </div>
      <Table.Root className="w-[450px] mt-2">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Epoch</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Reward(tao)</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Claim</Table.ColumnHeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>100</Table.Cell>
            <Table.Cell>
              <Button>Claim</Button>
            </Table.Cell>
          </Table.Row>
        </Table.Header>
      </Table.Root>
    </main>
  );
}

export default Page;
